import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ImagePlus, LogOut, Pencil, Plus, Save, ShieldCheck, Trash2, Users, X } from "lucide-react";
import { createPesapalPayment, listTeam, readRecords, readBookings, readSiteImages, removeRecord, removeUserRole, saveRecord, updateRecord, updateUserRole, uploadManagedImage } from "@/integrations/firebase/data";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ReservationsPanel from "@/components/admin/ReservationsPanel";
import { toast } from "@/components/ui/use-toast";

 type Room = { id: string; name: string; slug: string; description: string | null; total_rooms: number; max_guests: number; image_url: string | null; sort_order: number; is_active: boolean };
 type RoomPackage = { id: string; room_id: string; name: string; offerings: string[]; price: number; sort_order: number; is_active: boolean };
 type GalleryImage = { id: string; title: string; category: string; image_url: string; sort_order: number; is_active: boolean };
 type Activity = { id: string; title: string; summary: string | null; details: string | null; duration: string | null; price: string | null; image_url: string | null; sort_order: number; is_active: boolean };
 type SiteImage = { id: string; key: string; label: string; image_url: string | null };
 type TeamMember = { user_id: string; role: string; email: string; full_name: string };
 type Booking = { id: string; guest_name: string; guest_email: string; guest_phone?: string; check_in: string; check_out: string; rooms: number; room_type_id?: string; room_name?: string; total_amount?: number; status: string; payment_status: string; checked_in_at?: string; checked_out_at?: string };
  type Section = "overview" | "rooms" | "packages" | "gallery" | "images" | "activities" | "reservations" | "team";

 const emptyRoom = { name: "", slug: "", description: "", total_rooms: 5, max_guests: 2, image_url: "", sort_order: 0, is_active: true };
 const emptyPackage = { room_id: "", name: "", offerings: [""], price: 0, sort_order: 0, is_active: true };
const emptyGallery = { title: "", category: "The Lodge", image_url: "", sort_order: 0, is_active: true };
const emptyActivity = { title: "", summary: "", details: "", duration: "", price: "", image_url: "", sort_order: 0, is_active: true };
const emptySiteImage = { key: "", label: "", image_url: "" };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isSuperAdmin, loading, signOut } = useAuth();
  const [section, setSection] = useState<Section>("overview");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [packages, setPackages] = useState<RoomPackage[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [siteImages, setSiteImages] = useState<SiteImage[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [roomForm, setRoomForm] = useState<typeof emptyRoom & { id?: string }>(emptyRoom);
  const [packageForm, setPackageForm] = useState<typeof emptyPackage & { id?: string }>(emptyPackage);
  const [galleryForm, setGalleryForm] = useState<typeof emptyGallery & { id?: string }>(emptyGallery);
  const [activityForm, setActivityForm] = useState<typeof emptyActivity & { id?: string }>(emptyActivity);
  const [siteImageForm, setSiteImageForm] = useState<typeof emptySiteImage & { editingKey?: string }>(emptySiteImage);
  const [teamEmail, setTeamEmail] = useState("");
  const [teamUid, setTeamUid] = useState("");
  const [teamRole, setTeamRole] = useState<"admin" | "super_admin">("admin");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const loadData = async () => {
    const bookingResult = await readBookings<Booking>();
    setBookings(bookingResult);
    if (isSuperAdmin) {
      const [roomResult, galleryResult, activityResult, imageResult, packageResult] = await Promise.all([
        readRecords<Room>("rooms"), readRecords<GalleryImage>("gallery"), readRecords<Activity>("activities"), readSiteImages<SiteImage>(), readRecords<RoomPackage>("roomPackages"),
      ]);
      setRooms(roomResult); setGallery(galleryResult); setActivities(activityResult); setSiteImages(imageResult); setPackages(packageResult);
      const teamRecords = await listTeam();
      setTeam(teamRecords.map((member) => ({ user_id: member.id, role: String(member.role ?? "pending"), email: String(member.email ?? ""), full_name: String(member.name ?? "") })));
    }
  };

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate("/admin/login", { replace: true });
    if (user && isAdmin) void loadData();
  }, [isAdmin, isSuperAdmin, loading, navigate, user]);

  const run = async (operation: () => Promise<{ error: { message: string } | null }>) => {
    setBusy(true);
    setMessage("");
    const result = await operation();
    setBusy(false);
    if (result.error) {
      setMessage(result.error.message);
      toast({ title: "Action failed", description: result.error.message, variant: "destructive" });
      return false;
    }
    await loadData();
    toast({ title: "Saved", description: "Your changes are now live." });
    return true;
  };

  const saveRoom = async (event: FormEvent) => {
    event.preventDefault();
    if (await run(async () => { try { await saveRecord("rooms", roomForm, roomForm.id); return { error: null }; } catch (error) { return { error: error as { message: string } }; } })) setRoomForm(emptyRoom);
  };

  const savePackage = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { ...packageForm, offerings: packageForm.offerings.map((item) => item.trim()).filter(Boolean) };
    if (!payload.offerings.length) {
      toast({ title: "Add an offering", description: "Add at least one item to this package.", variant: "destructive" });
      return;
    }
    if (await run(async () => { try { await saveRecord("roomPackages", payload, packageForm.id); return { error: null }; } catch (error) { return { error: error as { message: string } }; } })) setPackageForm(emptyPackage);
  };

  const saveGallery = async (event: FormEvent) => {
    event.preventDefault();
    await run(async () => { try { await saveRecord("gallery", galleryForm, galleryForm.id); return { error: null }; } catch (error) { return { error: error as { message: string } }; } });
    setGalleryForm(emptyGallery);
  };

  const saveActivity = async (event: FormEvent) => {
    event.preventDefault();
    await run(async () => { try { await saveRecord("activities", activityForm, activityForm.id); return { error: null }; } catch (error) { return { error: error as { message: string } }; } });
    setActivityForm(emptyActivity);
  };

  const saveSiteImage = async (event: FormEvent) => {
    event.preventDefault();
    const payload = { key: siteImageForm.key, label: siteImageForm.label, image_url: siteImageForm.image_url };
    await run(async () => { try { await saveRecord("siteImages", payload, siteImageForm.editingKey || siteImageForm.key); return { error: null }; } catch (error) { return { error: error as { message: string } }; } });
    setSiteImageForm(emptySiteImage);
  };

  const remove = async (table: "room_types" | "gallery_images" | "activities", id: string) => {
    if (!window.confirm("Delete this item? This action cannot be undone.")) return;
    if (await run(async () => { try { await removeRecord(table === "room_types" ? "rooms" : table === "gallery_images" ? "gallery" : "activities", id); return { error: null }; } catch (error) { return { error: error as { message: string } }; } })) toast({ title: "Deleted", description: "The item was removed." });
  };

  const removeSiteImage = async (imageKey: string) => {
    if (!window.confirm("Delete this image? This action cannot be undone.")) return;
    if (await run(async () => { try { await removeRecord("siteImages", imageKey); return { error: null }; } catch (error) { return { error: error as { message: string } }; } })) toast({ title: "Deleted", description: "The image was removed." });
  };

  const removePackage = async (id: string) => {
    if (!window.confirm("Delete this package? This action cannot be undone.")) return;
    if (await run(async () => { try { await removeRecord("roomPackages", id); return { error: null }; } catch (error) { return { error: error as { message: string } }; } })) toast({ title: "Deleted", description: "The package was removed." });
  };

  const updateBooking = async (id: string, field: "status" | "payment_status", value: string) => {
    await run(async () => { try { await updateRecord("bookings", id, { [field]: value }); return { error: null }; } catch (error) { return { error: error as { message: string } }; } });
  };

  const createBooking = async (draft: Record<string, unknown>) => {
    await run(async () => {
      try {
        const booking = { draft, created_at: new Date().toISOString(), status: "confirmed", payment_status: draft.payment_status || "unpaid" };
        const bookingId = await saveRecord("bookings", booking);
        if (Number(draft.total_amount) > 0) {
          try {
            const payment = await createPesapalPayment({ id: bookingId, guest_name: String(draft.guest_name), guest_email: String(draft.guest_email), guest_phone: String(draft.guest_phone || ""), total_amount: Number(draft.total_amount), room_name: String(draft.room_name || "") });
            await updateRecord("bookings", bookingId, { payment_link: payment.redirect_url, pesapal_tracking_id: payment.order_tracking_id, payment_status: "payment_link_sent" });
            window.open(payment.redirect_url, "_blank", "noopener,noreferrer");
          } catch (error) {
            setMessage(`Reservation saved, but payment link could not be created: ${(error as Error).message}`);
          }
        }
        return { error: null };
      } catch (error) { return { error: error as { message: string } }; }
    });
  };

  const updateReservation = async (id: string, changes: Record<string, unknown>) => {
    await run(async () => { try { await updateRecord("bookings", id, changes); return { error: null }; } catch (error) { return { error: error as { message: string } }; } });
  };

  const createPaymentLink = async (booking: Booking) => {
    try {
      const payment = await createPesapalPayment(booking);
      await updateReservation(booking.id, { payment_link: payment.redirect_url, payment_status: "payment_link_sent" });
      window.open(payment.redirect_url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setMessage((error as Error).message);
    }
  };

  const addTeamMember = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    let error: Error | null = null;
    try { await updateUserRole(teamEmail, teamRole, teamUid || undefined); } catch (caught) { error = caught as Error; }
    setBusy(false);
    setMessage(error?.message ?? "Team access updated.");
    if (!error) { setTeamEmail(""); setTeamUid(""); await loadData(); }
  };

  const removeTeamMember = async (member: TeamMember) => {
    try { await removeUserRole(member.user_id); setMessage("Team access removed."); } catch (error) { setMessage((error as Error).message); }
    await loadData();
  };

  if (loading || !user || !isAdmin) return <div className="flex min-h-screen items-center justify-center bg-muted text-muted-foreground">Loading admin portal...</div>;

  const navItems: { id: Section; label: string; superOnly?: boolean }[] = [
    { id: "overview", label: "Overview" },
    { id: "rooms", label: "Rooms", superOnly: true },
    { id: "packages", label: "Packages & offerings", superOnly: true },
    { id: "gallery", label: "Gallery", superOnly: true },
    { id: "images", label: "Main images & rates", superOnly: true },
    { id: "activities", label: "Explore activities", superOnly: true },
    { id: "reservations", label: "Reservations" },
    { id: "team", label: "Team", superOnly: true },
  ];

  return (
    <div className="min-h-screen bg-muted">
      <header className="border-b border-border bg-card"><div className="safari-container flex flex-wrap items-center justify-between gap-4 py-5"><div><Link to="/" className="font-display text-2xl font-bold text-primary">TEMBO SAFARI LODGE</Link><p className="text-sm text-muted-foreground">Operations dashboard</p></div><div className="flex items-center gap-3"><span className="hidden text-sm text-muted-foreground sm:inline">{user.email}</span><Button variant="outline" size="sm" onClick={() => void signOut().then(() => navigate("/admin/login"))}><LogOut size={16} className="mr-2" /> Sign out</Button></div></div></header>
      <div className="safari-container grid gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <aside className="self-start rounded-lg bg-card p-3 shadow-soft"><div className="mb-3 flex items-center gap-2 px-3 py-2 text-sm font-semibold text-primary"><ShieldCheck size={17} /> {isSuperAdmin ? "Super admin" : "Admin · read only"}</div>{navItems.filter((item) => !item.superOnly || isSuperAdmin).map((item) => <button key={item.id} type="button" onClick={() => setSection(item.id)} className={`w-full rounded-md px-3 py-2 text-left text-sm font-medium ${section === item.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>{item.label}</button>)}</aside>
        <main className="min-w-0">{message && <p className="mb-5 rounded-md border border-border bg-card p-3 text-sm text-muted-foreground">{message}</p>}{section === "overview" && <Overview rooms={rooms} gallery={gallery} activities={activities} bookings={bookings} isSuperAdmin={isSuperAdmin} setSection={setSection} />}{section === "rooms" && isSuperAdmin && <CrudSection title="Rooms" description="Manage the room types displayed on the homepage." form={<RoomForm value={roomForm} setValue={setRoomForm} onSubmit={saveRoom} busy={busy} />}><div className="grid gap-4 md:grid-cols-2">{rooms.map((room) => <RecordCard key={room.id} title={room.name} subtitle={`${room.total_rooms} rooms · up to ${room.max_guests} guests`} image={room.image_url} active={room.is_active} onEdit={() => setRoomForm({ ...room, description: room.description ?? "", image_url: room.image_url ?? "" })} onDelete={() => void remove("room_types", room.id)} />)}</div></CrudSection>}{section === "packages" && isSuperAdmin && <CrudSection title="Packages and offerings" description="Create accommodation packages separately from rooms. Each package can have multiple offerings and one price." form={<RoomPackageForm value={packageForm} rooms={rooms} setValue={setPackageForm} onSubmit={savePackage} busy={busy} />}><div className="grid gap-4 md:grid-cols-2">{packages.map((pkg) => <RecordCard key={pkg.id} title={pkg.name} subtitle={`${rooms.find((room) => room.id === pkg.room_id)?.name ?? "Room"} · $${Number(pkg.price).toFixed(2)}`} active={pkg.is_active} onEdit={() => setPackageForm({ ...pkg, offerings: pkg.offerings?.length ? pkg.offerings : [""] })} onDelete={() => void removePackage(pkg.id)} />)}</div></CrudSection>}{section === "gallery" && isSuperAdmin && <CrudSection title="Gallery" description="Add, edit, reorder, or hide lodge and wildlife gallery images." form={<GalleryForm value={galleryForm} setValue={setGalleryForm} onSubmit={saveGallery} busy={busy} />}><div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">{gallery.map((image) => <RecordCard key={image.id} title={image.title} subtitle={image.category} image={image.image_url} active={image.is_active} onEdit={() => setGalleryForm(image)} onDelete={() => void remove("gallery_images", image.id)} />)}</div></CrudSection>}{section === "images" && isSuperAdmin && <CrudSection title="Main images and price schedule" description="Manage the hero, logo, price schedule poster, and other site-wide image slots." form={<SiteImageForm value={siteImageForm} setValue={setSiteImageForm} onSubmit={saveSiteImage} busy={busy} />}><div className="grid gap-4 md:grid-cols-2">{siteImages.map((image) => <RecordCard key={image.key} title={image.label} subtitle={image.key} image={image.image_url} onEdit={() => setSiteImageForm({ ...image, editingKey: image.key })} onDelete={() => void removeSiteImage(image.key)} />)}</div></CrudSection>}{section === "activities" && isSuperAdmin && <CrudSection title="Explore activities" description="Manage the experiences shown under Explore." form={<ActivityForm value={activityForm} setValue={setActivityForm} onSubmit={saveActivity} busy={busy} />}><div className="grid gap-4 md:grid-cols-2">{activities.map((activity) => <RecordCard key={activity.id} title={activity.title} subtitle={`${activity.duration ?? "Flexible"}${activity.price ? ` · ${activity.price}` : ""}`} image={activity.image_url} active={activity.is_active} onEdit={() => setActivityForm(activity)} onDelete={() => void remove("activities", activity.id)} />)}</div></CrudSection>}{section === "reservations" && <ReservationsPanel bookings={bookings} isSuperAdmin={isSuperAdmin} onCreate={createBooking} onUpdate={updateReservation} onCreatePayment={createPaymentLink} />}{section === "team" && isSuperAdmin && <Team team={team} email={teamEmail} role={teamRole} setEmail={setTeamEmail} setRole={setTeamRole} onSubmit={addTeamMember} onRemove={removeTeamMember} busy={busy} />}</main>
      </div>
    </div>
  );
};

const Overview = ({ rooms, gallery, activities, bookings, isSuperAdmin, setSection }: { rooms: Room[]; gallery: GalleryImage[]; activities: Activity[]; bookings: Booking[]; isSuperAdmin: boolean; setSection: (section: Section) => void }) => <div><p className="mb-2 text-sm font-semibold uppercase text-secondary">Good to see you</p><h1 className="mb-8 font-display text-5xl font-bold">Lodge operations</h1><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{[["Rooms", rooms.length, "rooms"], ["Gallery", gallery.length, "gallery"], ["Activities", activities.length, "activities"], ["Reservations", bookings.length, "reservations"]].map(([label, value, target]) => <button type="button" key={label} onClick={() => setSection(target as Section)} className="rounded-lg bg-card p-6 text-left shadow-soft hover:shadow-medium"><span className="text-sm text-muted-foreground">{label}</span><strong className="mt-2 block text-4xl text-primary">{value}</strong></button>)}</div><div className="mt-8 rounded-lg bg-primary p-8 text-primary-foreground"><h2 className="mb-3 font-display text-3xl font-bold">{isSuperAdmin ? "You have full control" : "Reservations are ready"}</h2><p className="max-w-2xl text-primary-foreground/80">{isSuperAdmin ? "Keep the lodge content current, update rates, and give the reservations team the access they need." : "You can review reservations and keep guest details moving, but content and team settings are restricted to the super admin."}</p></div></div>;

const CrudSection = ({ title, description, form, children }: { title: string; description: string; form: React.ReactNode; children: React.ReactNode }) => <section><div className="mb-7"><p className="mb-2 text-sm font-semibold uppercase text-secondary">Content management</p><h1 className="font-display text-4xl font-bold">{title}</h1><p className="mt-2 text-muted-foreground">{description}</p></div><div className="mb-8 rounded-lg bg-card p-6 shadow-soft">{form}</div>{children}</section>;

const RecordCard = ({ title, subtitle, image, active, onEdit, onDelete }: { title: string; subtitle: string; image?: string | null; active?: boolean; onEdit: () => void; onDelete: () => void }) => <article className="overflow-hidden rounded-lg bg-card shadow-soft">{image ? <img src={image} alt="" className="aspect-[16/9] w-full object-cover" /> : <div className="flex aspect-[16/9] items-center justify-center bg-muted text-muted-foreground"><ImagePlus /></div>}<div className="p-4"><div className="flex items-start justify-between gap-3"><div><h2 className="font-semibold">{title}</h2><p className="text-sm text-muted-foreground">{subtitle}</p></div>{active !== undefined && <span className={`text-xs font-semibold uppercase ${active ? "text-primary" : "text-muted-foreground"}`}>{active ? "Live" : "Hidden"}</span>}</div><div className="mt-4 flex gap-2"><Button size="sm" variant="outline" onClick={onEdit}><Pencil size={15} className="mr-2" /> Edit</Button><Button size="sm" variant="ghost" onClick={onDelete} aria-label={`Delete ${title}`}><Trash2 size={15} /></Button></div></div></article>;

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => <label className="block text-sm font-medium">{label}{children}</label>;
const ManagedImageField = ({ value, folder, onChange }: { value: string; folder: string; onChange: (value: string) => void }) => <div className="mt-2 space-y-2"><Input value={value} onChange={(event) => onChange(event.target.value)} placeholder="https://... or upload a file" /><input type="file" accept="image/*" onChange={async (event) => { const file = event.target.files?.[0]; if (file) onChange(await uploadManagedImage(file, folder)); }} className="block w-full text-sm text-muted-foreground file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-2 file:text-primary-foreground" /></div>;
const FormActions = ({ busy, editing, onCancel }: { busy: boolean; editing: boolean; onCancel: () => void }) => <div className="flex gap-3"><Button disabled={busy} type="submit"><Save size={16} className="mr-2" />{editing ? "Save changes" : "Add item"}</Button>{editing && <Button type="button" variant="ghost" onClick={onCancel}><X size={16} className="mr-2" />Cancel</Button>}</div>;

const RoomForm = ({ value, setValue, onSubmit, busy }: { value: typeof emptyRoom & { id?: string }; setValue: (value: typeof emptyRoom & { id?: string }) => void; onSubmit: (event: FormEvent) => void; busy: boolean }) => <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2"><Field label="Room name"><Input required value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value, slug: value.id ? value.slug : event.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-") })} /></Field><Field label="Slug"><Input required value={value.slug} onChange={(event) => setValue({ ...value, slug: event.target.value })} /></Field><Field label="Description"><Textarea value={value.description} onChange={(event) => setValue({ ...value, description: event.target.value })} /></Field><Field label="Image URL"><Input value={value.image_url} onChange={(event) => setValue({ ...value, image_url: event.target.value })} placeholder="https://..." /></Field><Field label="Total rooms"><Input type="number" min="0" value={value.total_rooms} onChange={(event) => setValue({ ...value, total_rooms: Number(event.target.value) })} /></Field><Field label="Maximum guests"><Input type="number" min="1" value={value.max_guests} onChange={(event) => setValue({ ...value, max_guests: Number(event.target.value) })} /></Field><Field label="Sort order"><Input type="number" value={value.sort_order} onChange={(event) => setValue({ ...value, sort_order: Number(event.target.value) })} /></Field><div className="md:col-span-2"><FormActions busy={busy} editing={Boolean(value.id)} onCancel={() => setValue(emptyRoom)} /></div></form>;

const RoomPackageForm = ({ value, rooms, setValue, onSubmit, busy }: { value: typeof emptyPackage & { id?: string }; rooms: Room[]; setValue: (value: typeof emptyPackage & { id?: string }) => void; onSubmit: (event: FormEvent) => void; busy: boolean }) => <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2"><Field label="Room"><select required value={value.room_id} onChange={(event) => setValue({ ...value, room_id: event.target.value })} className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2"><option value="">Select a room</option>{rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}</select></Field><Field label="Package name"><Input required value={value.name} onChange={(event) => setValue({ ...value, name: event.target.value })} placeholder="Full Board" /></Field><div className="md:col-span-2 rounded-md border border-border p-4"><div className="mb-3 flex items-center justify-between"><h3 className="font-semibold">What is offered</h3><Button type="button" variant="outline" size="sm" onClick={() => setValue({ ...value, offerings: [...value.offerings, ""] })}><Plus size={15} className="mr-2" /> Add offering</Button></div><div className="space-y-3">{value.offerings.map((offering, index) => <div key={index} className="flex gap-2"><Input required value={offering} onChange={(event) => setValue({ ...value, offerings: value.offerings.map((item, i) => i === index ? event.target.value : item) })} placeholder="Private bathroom and balcony" /><Button type="button" variant="ghost" onClick={() => setValue({ ...value, offerings: value.offerings.filter((_, i) => i !== index) })} aria-label="Remove offering"><Trash2 size={16} /></Button></div>)}</div></div><Field label="Package price"><Input required type="number" min="0" step="0.01" value={value.price} onChange={(event) => setValue({ ...value, price: Number(event.target.value) })} /></Field><Field label="Sort order"><Input type="number" value={value.sort_order} onChange={(event) => setValue({ ...value, sort_order: Number(event.target.value) })} /></Field><div className="md:col-span-2"><FormActions busy={busy} editing={Boolean(value.id)} onCancel={() => setValue(emptyPackage)} /></div></form>;

const GalleryForm = ({ value, setValue, onSubmit, busy }: { value: typeof emptyGallery & { id?: string }; setValue: (value: typeof emptyGallery & { id?: string }) => void; onSubmit: (event: FormEvent) => void; busy: boolean }) => <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2"><Field label="Title"><Input required value={value.title} onChange={(event) => setValue({ ...value, title: event.target.value })} /></Field><Field label="Category"><Input required value={value.category} onChange={(event) => setValue({ ...value, category: event.target.value })} /></Field><Field label="Image URL"><Input required value={value.image_url} onChange={(event) => setValue({ ...value, image_url: event.target.value })} placeholder="https://..." /></Field><Field label="Sort order"><Input type="number" value={value.sort_order} onChange={(event) => setValue({ ...value, sort_order: Number(event.target.value) })} /></Field><div className="md:col-span-2"><FormActions busy={busy} editing={Boolean(value.id)} onCancel={() => setValue(emptyGallery)} /></div></form>;

const ActivityForm = ({ value, setValue, onSubmit, busy }: { value: typeof emptyActivity & { id?: string }; setValue: (value: typeof emptyActivity & { id?: string }) => void; onSubmit: (event: FormEvent) => void; busy: boolean }) => <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2"><Field label="Title"><Input required value={value.title} onChange={(event) => setValue({ ...value, title: event.target.value })} /></Field><Field label="Duration"><Input value={value.duration} onChange={(event) => setValue({ ...value, duration: event.target.value })} placeholder="Half day" /></Field><Field label="Summary"><Textarea value={value.summary} onChange={(event) => setValue({ ...value, summary: event.target.value })} /></Field><Field label="Details"><Textarea value={value.details} onChange={(event) => setValue({ ...value, details: event.target.value })} /></Field><Field label="Price"><Input value={value.price} onChange={(event) => setValue({ ...value, price: event.target.value })} /></Field><Field label="Image URL"><Input value={value.image_url} onChange={(event) => setValue({ ...value, image_url: event.target.value })} placeholder="https://..." /></Field><div className="md:col-span-2"><FormActions busy={busy} editing={Boolean(value.id)} onCancel={() => setValue(emptyActivity)} /></div></form>;

const SiteImageForm = ({ value, setValue, onSubmit, busy }: { value: typeof emptySiteImage & { editingKey?: string }; setValue: (value: typeof emptySiteImage & { editingKey?: string }) => void; onSubmit: (event: FormEvent) => void; busy: boolean }) => <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2"><Field label="Key"><Input required disabled={Boolean(value.editingKey)} value={value.key} onChange={(event) => setValue({ ...value, key: event.target.value })} placeholder="hero or price_schedule" /></Field><Field label="Label"><Input required value={value.label} onChange={(event) => setValue({ ...value, label: event.target.value })} /></Field><div className="md:col-span-2"><Field label="Image URL"><Input required value={value.image_url} onChange={(event) => setValue({ ...value, image_url: event.target.value })} placeholder="https://..." /></Field></div><div className="md:col-span-2"><FormActions busy={busy} editing={Boolean(value.editingKey)} onCancel={() => setValue(emptySiteImage)} /></div></form>;

const Reservations = ({ bookings, onUpdate, readOnly }: { bookings: Booking[]; onUpdate: (id: string, field: "status" | "payment_status", value: string) => void; readOnly: boolean }) => <section><p className="mb-2 text-sm font-semibold uppercase text-secondary">Guest management</p><h1 className="mb-2 font-display text-4xl font-bold">Reservations</h1><p className="mb-7 text-muted-foreground">{readOnly ? "Read-only access for the reservations team." : "Review and update booking status and payments."}</p><div className="overflow-x-auto rounded-lg bg-card shadow-soft"><table className="w-full min-w-[760px] text-left text-sm"><thead className="border-b border-border text-muted-foreground"><tr><th className="p-4">Guest</th><th className="p-4">Stay</th><th className="p-4">Room</th><th className="p-4">Booking</th><th className="p-4">Payment</th></tr></thead><tbody>{bookings.map((booking) => <tr key={booking.id} className="border-b border-border last:border-0"><td className="p-4"><strong>{booking.guest_name}</strong><br /><span className="text-muted-foreground">{booking.guest_email}</span></td><td className="p-4">{booking.check_in} to {booking.check_out}<br />{booking.rooms} room(s)</td><td className="p-4">{booking.room_types?.name ?? "Unassigned"}</td><td className="p-4"><select disabled={readOnly} value={booking.status} onChange={(event) => onUpdate(booking.id, "status", event.target.value)} className="rounded-md border border-border bg-background px-2 py-2"><option>pending</option><option>confirmed</option><option>cancelled</option></select></td><td className="p-4"><select disabled={readOnly} value={booking.payment_status} onChange={(event) => onUpdate(booking.id, "payment_status", event.target.value)} className="rounded-md border border-border bg-background px-2 py-2"><option>unpaid</option><option>partially_paid</option><option>paid</option></select></td></tr>)}</tbody></table>{bookings.length === 0 && <p className="p-8 text-center text-muted-foreground">No reservations yet.</p>}</div></section>;

const Team = ({ team, email, role, setEmail, setRole, onSubmit, onRemove, busy }: { team: TeamMember[]; email: string; role: "admin" | "super_admin"; setEmail: (email: string) => void; setRole: (role: "admin" | "super_admin") => void; onSubmit: (event: FormEvent) => void; onRemove: (member: TeamMember) => void; busy: boolean }) => <section><p className="mb-2 text-sm font-semibold uppercase text-secondary">Access control</p><h1 className="mb-2 font-display text-4xl font-bold">Team access</h1><p className="mb-7 text-muted-foreground">Create accounts from the login screen, then assign one of the two lodge roles here.</p><form onSubmit={onSubmit} className="mb-8 flex flex-col gap-3 rounded-lg bg-card p-6 shadow-soft sm:flex-row"><Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="team member email" /><select value={role} onChange={(event) => setRole(event.target.value as "admin" | "super_admin")} className="rounded-md border border-border bg-background px-3 py-2"><option value="admin">Admin · reservations read</option><option value="super_admin">Super admin · all control</option></select><Button disabled={busy} type="submit"><Plus size={16} className="mr-2" /> Add access</Button></form><div className="space-y-3">{team.map((member) => <div key={`${member.user_id}-${member.role}`} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-card p-4 shadow-soft"><div className="flex items-center gap-3"><Users className="text-primary" size={18} /><div><strong>{member.full_name || member.email}</strong><p className="text-sm text-muted-foreground">{member.email} · {member.role === "super_admin" ? "Super admin" : "Admin"}</p></div></div><Button variant="ghost" size="sm" onClick={() => onRemove(member)}><Trash2 size={15} className="mr-2" /> Remove</Button></div>)}</div></section>;

export default AdminDashboard;
