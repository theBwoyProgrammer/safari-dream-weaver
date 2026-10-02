import { useEffect, useState } from "react";
import { Check, ClipboardPlus, ExternalLink, LogIn, LogOut, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in: string;
  check_out: string;
  rooms: number;
  room_type_id?: string;
  room_name?: string;
  total_amount?: number;
  payment_link?: string;
  status: string;
  payment_status: string;
  checked_in_at?: string;
  checked_out_at?: string;
};

type BookingDraft = Omit<Booking, "id">;
const emptyDraft: BookingDraft = { guest_name: "", guest_email: "", guest_phone: "", check_in: "", check_out: "", rooms: 1, room_type_id: "", room_name: "", total_amount: 0, status: "confirmed", payment_status: "unpaid" };

const nightsBetween = (from: string, to: string) => {
  if (!from || !to) return 0;
  return Math.max(0, Math.ceil((new Date(`${to}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime()) / 86400000));
};

const remainingNights = (booking: Booking) => {
  if (booking.status !== "checked_in") return null;
  return Math.max(0, nightsBetween(new Date().toISOString().slice(0, 10), booking.check_out));
};

const ReservationsPanel = ({ bookings, isSuperAdmin, onCreate, onUpdate, onCreatePayment }: { bookings: Booking[]; isSuperAdmin: boolean; onCreate: (draft: BookingDraft) => Promise<void>; onUpdate: (id: string, changes: Record<string, unknown>) => Promise<void>; onCreatePayment: (booking: Booking) => Promise<void> }) => {
  const [draft, setDraft] = useState<BookingDraft>(emptyDraft);
  const [showForm, setShowForm] = useState(false);
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const timer = window.setInterval(() => setNow(Date.now()), 60000); return () => window.clearInterval(timer); }, []);
  void now;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onCreate(draft);
    setDraft(emptyDraft);
    setShowForm(false);
  };

  return <section>
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm font-semibold uppercase text-secondary">Guest management</p><h1 className="mb-2 font-display text-4xl font-bold">Reservations</h1><p className="text-muted-foreground">Record the personal booking conversation, payment, arrival, and departure.</p></div><Button onClick={() => setShowForm(!showForm)}><ClipboardPlus size={17} className="mr-2" /> New reservation</Button></div>
    {showForm && <form onSubmit={submit} className="mb-8 grid gap-4 rounded-lg bg-card p-6 shadow-soft md:grid-cols-2"><h2 className="md:col-span-2 font-display text-2xl font-bold">Add a reservation</h2><label className="text-sm font-medium">Guest name<Input required value={draft.guest_name} onChange={(event) => setDraft({ ...draft, guest_name: event.target.value })} /></label><label className="text-sm font-medium">Email<Input required type="email" value={draft.guest_email} onChange={(event) => setDraft({ ...draft, guest_email: event.target.value })} /></label><label className="text-sm font-medium">Phone<Input value={draft.guest_phone} onChange={(event) => setDraft({ ...draft, guest_phone: event.target.value })} /></label><label className="text-sm font-medium">Room booked<Input value={draft.room_name} onChange={(event) => setDraft({ ...draft, room_name: event.target.value })} placeholder="Standard single" /></label><label className="text-sm font-medium">Check-in<Input required type="date" value={draft.check_in} onChange={(event) => setDraft({ ...draft, check_in: event.target.value })} /></label><label className="text-sm font-medium">Check-out<Input required type="date" value={draft.check_out} onChange={(event) => setDraft({ ...draft, check_out: event.target.value })} /></label><label className="text-sm font-medium">Rooms<Input required type="number" min="1" value={draft.rooms} onChange={(event) => setDraft({ ...draft, rooms: Number(event.target.value) })} /></label><label className="text-sm font-medium">Total agreed amount<Input type="number" min="0" value={draft.total_amount} onChange={(event) => setDraft({ ...draft, total_amount: Number(event.target.value) })} /></label><div className="md:col-span-2"><Button type="submit"><Save size={16} className="mr-2" /> Save reservation</Button></div></form>}
    <div className="space-y-4">{bookings.map((booking) => <ReservationCard key={booking.id} booking={booking} isSuperAdmin={isSuperAdmin} onUpdate={onUpdate} onCreatePayment={onCreatePayment} />)}{bookings.length === 0 && <div className="rounded-lg bg-card p-8 text-center text-muted-foreground">No reservations yet. Add one after the lodge team has spoken with the visitor.</div>}</div>
  </section>;
};

const ReservationCard = ({ booking, isSuperAdmin, onUpdate, onCreatePayment }: { booking: Booking; isSuperAdmin: boolean; onUpdate: (id: string, changes: Record<string, unknown>) => Promise<void>; onCreatePayment: (booking: Booking) => Promise<void> }) => {
  const nights = nightsBetween(booking.check_in, booking.check_out);
  const remaining = remainingNights(booking);
  const canCheckIn = booking.status === "confirmed" && new Date(`${booking.check_in}T00:00:00`).getTime() <= Date.now();
  return <article className="rounded-lg bg-card p-5 shadow-soft"><div className="flex flex-wrap items-start justify-between gap-4"><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-bold">{booking.guest_name}</h2><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase text-primary">{booking.status.replace("_", " ")}</span></div><p className="mt-1 text-sm text-muted-foreground">{booking.guest_email}{booking.guest_phone ? ` · ${booking.guest_phone}` : ""}</p></div><div className="text-right"><p className="text-sm text-muted-foreground">{booking.room_name || "Room to confirm"}</p><p className="font-semibold">{nights} night{nights === 1 ? "" : "s"}</p></div></div><div className="mt-5 grid gap-3 border-t border-border pt-4 text-sm sm:grid-cols-3"><div><span className="text-muted-foreground">Stay</span><p>{booking.check_in} to {booking.check_out}</p></div><div><span className="text-muted-foreground">Payment</span><select value={booking.payment_status} onChange={(event) => void onUpdate(booking.id, { payment_status: event.target.value })} className="mt-1 block rounded-md border border-border bg-background px-2 py-1"><option>unpaid</option><option>payment_link_sent</option><option>partially_paid</option><option>paid</option></select></div><div><span className="text-muted-foreground">Countdown</span><p className={remaining === null ? "font-semibold text-primary" : remaining === 0 ? "font-semibold text-secondary" : "font-semibold text-primary"}>{remaining === null ? "Not checked in" : remaining === 0 ? "Visitor's check out" : `${remaining} night${remaining === 1 ? "" : "s"} remaining`}</p></div></div><div className="mt-5 flex flex-wrap gap-2"><Button size="sm" variant="outline" disabled={!booking.total_amount || booking.total_amount <= 0} onClick={() => void onCreatePayment(booking)}><ExternalLink size={15} className="mr-2" /> {booking.payment_link ? "Open payment link" : "Create payment link"}</Button>{canCheckIn && <Button size="sm" onClick={() => void onUpdate(booking.id, { status: "checked_in", checked_in_at: new Date().toISOString() })}><LogIn size={15} className="mr-2" /> Check in</Button>}{booking.status === "checked_in" && <Button size="sm" variant="secondary" onClick={() => void onUpdate(booking.id, { status: "checked_out", checked_out_at: new Date().toISOString() })}><LogOut size={15} className="mr-2" /> Check out</Button>}{booking.status === "checked_out" && <span className="inline-flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground"><Check size={15} /> Stay completed</span>}{isSuperAdmin && <Button size="sm" variant="outline" onClick={() => void onUpdate(booking.id, { status: "cancelled" })}>Cancel reservation</Button>}</div></article>;
};

export default ReservationsPanel;
