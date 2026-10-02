import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, updateDoc, where, type DocumentData, type QueryConstraint } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { firestore, firebaseStorage } from "@/integrations/firebase/client";
import { firebaseAuth } from "@/integrations/firebase/client";

export type Role = "super_admin" | "admin";
export type FirestoreRecord = DocumentData & { id: string };

const readCollection = async <T extends FirestoreRecord>(name: string, constraints: QueryConstraint[] = []) => {
  const snapshot = await getDocs(query(collection(firestore, name), ...constraints));
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() }) as T);
};

export const readRecords = <T extends FirestoreRecord>(name: string, sortField = "sort_order") =>
  readCollection<T>(name, [orderBy(sortField, "asc")]);

export const readPublicRecords = <T extends FirestoreRecord>(name: string, sortField = "sort_order") =>
  readCollection<T>(name, [where("is_active", "==", true), orderBy(sortField, "asc")]);

export const readBookings = <T extends FirestoreRecord>() =>
  readCollection<T>("bookings", [orderBy("created_at", "desc")]);

export const readSiteImages = <T extends FirestoreRecord>() =>
  readCollection<T>("siteImages", [orderBy("key", "asc")]);

export const getSiteImage = async (key: string) => {
  const snapshot = await getDoc(doc(firestore, "siteImages", key));
  return snapshot.exists() ? (snapshot.data().image_url as string | null) : null;
};

export const saveRecord = async <T extends Record<string, unknown>>(name: string, data: T, id?: string) => {
  const record = id ? doc(firestore, name, id) : doc(collection(firestore, name));
  await setDoc(record, { ...data, updated_at: new Date().toISOString() }, { merge: true });
  return record.id;
};

export const removeRecord = (name: string, id: string) => deleteDoc(doc(firestore, name, id));
export const updateRecord = (name: string, id: string, data: Record<string, unknown>) => updateDoc(doc(firestore, name, id), data);

export const getUserProfile = async (userId: string) => {
  const snapshot = await getDoc(doc(firestore, "users", userId));
  return snapshot.exists() ? snapshot.data() : null;
};

export const getUserProfileWithTimeout = async (userId: string, timeoutMs = 10000) => {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Firestore is taking too long to respond. Check your Firebase project and network connection.")), timeoutMs);
  });
  try {
    return await Promise.race([getUserProfile(userId), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
};

export const createPendingProfile = (userId: string, email: string, name: string) =>
  setDoc(doc(firestore, "users", userId), { email, name, role: "pending", created_at: new Date().toISOString() });

export const listTeam = () => readCollection<FirestoreRecord>("users");

export const updateUserRole = async (email: string, role: Role, userId?: string) => {
  if (!userId && !email.includes("@")) userId = email.trim();
  if (userId) {
    await setDoc(doc(firestore, "users", userId), { role, updated_at: new Date().toISOString() }, { merge: true });
    return;
  }
  const normalizedEmail = email.trim().toLowerCase();
  const snapshot = await getDocs(query(collection(firestore, "users"), where("email", "==", normalizedEmail)));
  if (snapshot.empty) throw new Error("No pending profile found. Ask the user to register at /admin/login, or provide their Firebase Auth UID.");
  await updateDoc(snapshot.docs[0].ref, { role, updated_at: new Date().toISOString() });
};

export const removeUserRole = (userId: string) => updateDoc(doc(firestore, "users", userId), { role: "pending", updated_at: new Date().toISOString() });

export const uploadManagedImage = async (file: File, folder: string) => {
  const path = `managed/${folder}/${crypto.randomUUID()}-${file.name}`;
  const imageRef = ref(firebaseStorage, path);
  await uploadBytes(imageRef, file, { contentType: file.type });
  return getDownloadURL(imageRef);
};

export const deleteManagedImage = (imageUrl: string) => {
  try {
    return deleteObject(ref(firebaseStorage, imageUrl));
  } catch {
    return Promise.resolve();
  }
};

export const createPesapalPayment = async (booking: { id: string; guest_name: string; guest_email: string; guest_phone?: string; total_amount?: number; room_name?: string }) => {
  const user = firebaseAuth.currentUser;
  if (!user) throw new Error("Sign in as an admin before creating a payment link.");
  const token = await user.getIdToken();
  const baseUrl = import.meta.env.VITE_FIREBASE_FUNCTIONS_URL || "https://us-central1-hatimdev-he.cloudfunctions.net";
  const response = await fetch(`${baseUrl}/createPesapalPayment`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ bookingId: booking.id, guestName: booking.guest_name, guestEmail: booking.guest_email, guestPhone: booking.guest_phone, amount: booking.total_amount, description: `${booking.room_name || "Lodge"} reservation` }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Could not create the Pesapal payment link.");
  return data as { redirect_url: string; order_tracking_id: string };
};

export { collection, doc, getDoc, getDocs, query, setDoc, where };
