import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { firebaseAuth } from "@/integrations/firebase/client";
import { getUserProfileWithTimeout, type Role } from "@/integrations/firebase/data";

interface AuthContextValue {
  user: User | null;
  roles: Role[];
  isSuperAdmin: boolean;
  isAdmin: boolean;
  loading: boolean;
  roleError: string | null;
  signOut: () => Promise<void>;
  refreshRoles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleError, setRoleError] = useState<string | null>(null);

  const loadRoles = async (userId: string | undefined) => {
    if (!userId) {
      setRoles([]);
      return;
    }
    try {
      const profile = await getUserProfileWithTimeout(userId);
      setRoles(profile?.role ? [profile.role as Role] : []);
      setRoleError(profile ? null : "No Firestore user profile exists for this Firebase account.");
    } catch (error) {
      setRoles([]);
      setRoleError((error as Error).message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
      void loadRoles(nextUser?.uid);
    });
    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    user,
    roles,
    isSuperAdmin: roles.includes("super_admin"),
    isAdmin: roles.includes("super_admin") || roles.includes("admin"),
    loading,
    roleError,
    signOut: () => firebaseSignOut(firebaseAuth),
    refreshRoles: () => loadRoles(user?.uid),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
