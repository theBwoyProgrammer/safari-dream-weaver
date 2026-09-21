CREATE POLICY "Staff upload lodge media" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'lodge-media' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff update lodge media" ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'lodge-media' AND public.is_staff(auth.uid()));

CREATE POLICY "Staff delete lodge media" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'lodge-media' AND public.is_staff(auth.uid()));

CREATE POLICY "Anyone can read lodge media" ON storage.objects FOR SELECT TO anon, authenticated
USING (bucket_id = 'lodge-media');