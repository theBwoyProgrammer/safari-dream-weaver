import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { firebaseAuth } from "@/integrations/firebase/client";
import { createPendingProfile, getUserProfileWithTimeout } from "@/integrations/firebase/data";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, roleError } = useAuth();
  const [mode, setMode] = useState<"sign_in" | "sign_up">("sign_in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user && isAdmin) navigate("/admin", { replace: true });
  }, [isAdmin, loading, navigate, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      if (mode === "sign_in") {
        const credential = await signInWithEmailAndPassword(firebaseAuth, email, password);
        const profile = await getUserProfileWithTimeout(credential.user.uid);
        if (!profile) throw new Error(`No Firestore profile exists for UID ${credential.user.uid}. Create users/${credential.user.uid} with role super_admin.`);
        if (profile.role !== "super_admin" && profile.role !== "admin") throw new Error(`This account has role "${String(profile.role ?? "pending")}". Set its Firestore role to super_admin or admin.`);
        setMessage("Signed in. Opening dashboard...");
        navigate("/admin", { replace: true });
      } else {
        const credential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
        await updateProfile(credential.user, { displayName: fullName });
        await createPendingProfile(credential.user.uid, email, fullName);
        setMessage("Account created. Ask the super admin to assign your role.");
      }
    } catch (caught) {
      const error = caught as { code?: string; message?: string };
      setMessage(`${error.code ? `${error.code}: ` : ""}${error.message ?? "Login failed. Please try again."}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted px-4 py-16">
      <section className="w-full max-w-md rounded-lg bg-card p-8 shadow-dramatic">
        <Link to="/" className="mb-10 inline-flex items-center gap-2 text-sm font-semibold text-primary"><ArrowLeft size={16} /> Back to website</Link>
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"><LockKeyhole /></div>
        <p className="mb-2 text-sm font-semibold uppercase text-secondary">Tembo team access</p>
        <h1 className="mb-3 font-display text-4xl font-bold">Admin portal</h1>
        <p className="mb-8 text-muted-foreground">Sign in to manage lodge content and reservations.</p>
        <form onSubmit={submit} className="space-y-5">
          {mode === "sign_up" && <label className="block text-sm font-medium">Full name<Input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="mt-2" /></label>}
          <label className="block text-sm font-medium">Email<Input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2" /></label>
          <label className="block text-sm font-medium">Password<Input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2" /></label>
          <Button disabled={busy} type="submit" className="w-full rounded-full">{busy ? "Working..." : mode === "sign_in" ? "Sign in" : "Create account"}</Button>
        </form>
        <button type="button" onClick={() => setMode(mode === "sign_in" ? "sign_up" : "sign_in")} className="mt-5 w-full text-sm font-semibold text-primary hover:underline">{mode === "sign_in" ? "Create a team account" : "Already have an account? Sign in"}</button>
        {user && !isAdmin && <div className="mt-8 border-t border-border pt-6"><p className="text-sm text-muted-foreground">This account is not authorized yet.</p><p className="mt-2 text-xs text-destructive">{roleError ?? "Expected role: super_admin or admin."}</p><p className="mt-2 break-all text-xs text-muted-foreground">Firebase UID: {user.uid}</p><p className="mt-1 text-xs text-muted-foreground">Project: {import.meta.env.VITE_FIREBASE_PROJECT_ID}</p></div>}
        {message && <p className="mt-5 rounded-md bg-muted p-3 text-sm text-muted-foreground">{message}</p>}
      </section>
    </main>
  );
};

export default AdminLogin;
