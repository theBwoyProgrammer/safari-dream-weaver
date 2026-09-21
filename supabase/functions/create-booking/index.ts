import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

const dayList = (checkIn: string, checkOut: string) => {
  const days: string[] = [];
  const cursor = new Date(checkIn + "T00:00:00Z");
  const end = new Date(checkOut + "T00:00:00Z");
  while (cursor < end) {
    days.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }
  return days;
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json();
    const {
      room_type_id,
      check_in,
      check_out,
      rooms = 1,
      adults = 1,
      children = 0,
      meal_plan = "full_board",
      guest_name,
      guest_email,
      guest_phone,
      notes,
    } = body ?? {};

    if (!room_type_id || !check_in || !check_out || !guest_name || !guest_email) {
      return json({ error: "Please fill in all required booking details." }, 400);
    }
    if (new Date(check_out) <= new Date(check_in)) {
      return json({ error: "Check-out must be after check-in." }, 400);
    }

    const { data: room, error: roomError } = await admin
      .from("room_types")
      .select("*")
      .eq("id", room_type_id)
      .maybeSingle();
    if (roomError) throw roomError;
    if (!room || !room.is_active) return json({ error: "That room is not available." }, 400);

    const { data: availability, error: availabilityError } = await admin.rpc("get_availability", {
      _start: check_in,
      _end: check_out,
    });
    if (availabilityError) throw availabilityError;

    const nights = dayList(check_in, check_out);
    const byDay = new Map<string, { total: number; booked: number; blocked: boolean }>();
    (availability ?? []).forEach((row: Record<string, unknown>) => {
      if (row.room_type_id !== room_type_id) return;
      byDay.set(String(row.day).slice(0, 10), {
        total: Number(row.total_rooms),
        booked: Number(row.booked_rooms),
        blocked: Boolean(row.is_blocked),
      });
    });

    const unavailable = nights.filter((day) => {
      const entry = byDay.get(day);
      if (!entry) return false;
      return entry.blocked || entry.total - entry.booked < Number(rooms);
    });
    if (unavailable.length > 0) {
      return json(
        { error: "Sorry, those dates are fully booked.", unavailable_dates: unavailable },
        409,
      );
    }

    const nightlyRate =
      meal_plan === "half_board"
        ? Number(room.price_half_board)
        : meal_plan === "bed_breakfast"
          ? Number(room.price_bed_breakfast)
          : Number(room.price_full_board);
    const total = nightlyRate * nights.length * Number(rooms);

    let userId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const { data } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
      userId = data.user?.id ?? null;
    }

    const { data: booking, error: insertError } = await admin
      .from("bookings")
      .insert({
        user_id: userId,
        room_type_id,
        guest_name,
        guest_email,
        guest_phone,
        check_in,
        check_out,
        rooms: Number(rooms),
        adults: Number(adults),
        children: Number(children),
        meal_plan,
        notes,
        total_amount: total,
        deposit_amount: Math.round(total * 0.3 * 100) / 100,
        status: "pending",
        payment_status: "unpaid",
      })
      .select("*")
      .single();
    if (insertError) throw insertError;

    return json({ booking, nights: nights.length, total });
  } catch (error) {
    console.error("create-booking failed", error);
    return json({ error: "Could not complete the booking. Please try again." }, 500);
  }
});
