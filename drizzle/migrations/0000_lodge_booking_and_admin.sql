-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff'))
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "Admins read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));

-- Profiles
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  email text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read own profile" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Update own profile" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid());
CREATE POLICY "Insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Room types
CREATE TABLE public.room_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  total_rooms integer NOT NULL DEFAULT 5,
  price_full_board numeric(10,2) NOT NULL DEFAULT 0,
  price_half_board numeric(10,2) NOT NULL DEFAULT 0,
  price_bed_breakfast numeric(10,2) NOT NULL DEFAULT 0,
  max_guests integer NOT NULL DEFAULT 2,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.room_types TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.room_types TO authenticated;
GRANT ALL ON public.room_types TO service_role;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active rooms" ON public.room_types FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage rooms" ON public.room_types FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER room_types_touch BEFORE UPDATE ON public.room_types FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Bookings
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE DEFAULT ('TSL-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,6))),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  room_type_id uuid REFERENCES public.room_types(id) ON DELETE SET NULL,
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text,
  check_in date NOT NULL,
  check_out date NOT NULL,
  rooms integer NOT NULL DEFAULT 1,
  adults integer NOT NULL DEFAULT 1,
  children integer NOT NULL DEFAULT 0,
  meal_plan text NOT NULL DEFAULT 'full_board',
  notes text,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  deposit_amount numeric(10,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'unpaid',
  payment_reference text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bookings_dates_idx ON public.bookings (check_in, check_out);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT INSERT ON public.bookings TO anon;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Guests create bookings" ON public.bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Guests view own bookings" ON public.bookings FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage bookings" ON public.bookings FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "Admins delete bookings" ON public.bookings FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER bookings_touch BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.validate_booking_dates()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.check_out <= NEW.check_in THEN
    RAISE EXCEPTION 'Check-out must be after check-in';
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER bookings_validate BEFORE INSERT OR UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.validate_booking_dates();

-- Manual closures / blocked dates
CREATE TABLE public.blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  room_type_id uuid REFERENCES public.room_types(id) ON DELETE CASCADE,
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blocked_dates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_dates TO authenticated;
GRANT ALL ON public.blocked_dates TO service_role;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view closures" ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Staff manage closures" ON public.blocked_dates FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Availability function: rooms taken per date range
CREATE OR REPLACE FUNCTION public.get_availability(_start date, _end date)
RETURNS TABLE (day date, room_type_id uuid, total_rooms integer, booked_rooms integer, is_blocked boolean)
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT d::date AS day,
         rt.id AS room_type_id,
         rt.total_rooms,
         COALESCE((SELECT SUM(b.rooms)::int FROM public.bookings b
                   WHERE b.room_type_id = rt.id
                     AND b.status IN ('pending','confirmed')
                     AND d::date >= b.check_in AND d::date < b.check_out), 0) AS booked_rooms,
         EXISTS (SELECT 1 FROM public.blocked_dates bd
                 WHERE (bd.room_type_id = rt.id OR bd.room_type_id IS NULL)
                   AND d::date >= bd.start_date AND d::date <= bd.end_date) AS is_blocked
  FROM generate_series(_start, _end, interval '1 day') AS d
  CROSS JOIN public.room_types rt
  WHERE rt.is_active;
$$;
GRANT EXECUTE ON FUNCTION public.get_availability(date, date) TO anon, authenticated;

-- Gallery
CREATE TABLE public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL DEFAULT 'The Lodge',
  image_url text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gallery_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_images TO authenticated;
GRANT ALL ON public.gallery_images TO service_role;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON public.gallery_images FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- Activities (Explore)
CREATE TABLE public.activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  summary text,
  details text,
  duration text,
  price text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.activities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.activities TO authenticated;
GRANT ALL ON public.activities TO service_role;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view activities" ON public.activities FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "Staff manage activities" ON public.activities FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER activities_touch BEFORE UPDATE ON public.activities FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Key site images (hero, rate poster, logo, etc.)
CREATE TABLE public.site_images (
  key text PRIMARY KEY,
  label text NOT NULL,
  image_url text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_images TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_images TO authenticated;
GRANT ALL ON public.site_images TO service_role;
ALTER TABLE public.site_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view site images" ON public.site_images FOR SELECT USING (true);
CREATE POLICY "Staff manage site images" ON public.site_images FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER site_images_touch BEFORE UPDATE ON public.site_images FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed data
INSERT INTO public.room_types (name, slug, description, total_rooms, price_full_board, price_half_board, price_bed_breakfast, max_guests, sort_order)
VALUES
 ('Standard Single', 'standard-single', 'Standard room with private balcony, mosquito net, self-contained bathroom and hot shower.', 5, 90, 80, 70, 1, 1),
 ('Double / Twin', 'double-twin', 'Double or twin room with private balcony, mosquito net and hot shower.', 5, 120, 100, 90, 2, 2),
 ('Triple Room', 'triple', 'Grass-thatched cottage sleeping three, with balcony and private bathroom.', 3, 160, 140, 120, 3, 3);

INSERT INTO public.activities (title, summary, details, duration, price, sort_order) VALUES
 ('Kazinga Channel boat cruise', 'Glide past hippos, buffalo and hundreds of birds on the channel.', 'Afternoon launch trips leave close to the lodge, just 300 metres away.', '2 hours', 'From $30 per person', 1),
 ('Guided game drive', 'Search for lions, elephants and antelope with an experienced guide.', 'Early morning and evening drives across the Kasenyi plains.', '3-4 hours', 'From $40 per person', 2),
 ('Nature walk & bird watching', 'Walk the channel banks with a ranger and spot over 600 recorded species.', 'Best at sunrise; binoculars recommended.', '2 hours', 'From $25 per person', 3),
 ('Biking tour', 'Ride village trails and park tracks around Katunguru.', 'Bikes and helmets provided by the lodge.', 'Half day', 'From $20 per person', 4),
 ('Fishing trip', 'Try your luck on the channel with local fishermen.', 'Equipment can be arranged with notice.', 'Half day', 'On request', 5);

INSERT INTO public.site_images (key, label) VALUES
 ('rate_poster', 'Price schedule poster'),
 ('home_hero', 'Homepage hero image'),
 ('accommodation_hero', 'Accommodation page hero'),
 ('logo', 'Lodge logo');
