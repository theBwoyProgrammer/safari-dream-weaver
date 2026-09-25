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

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Please sign in first." }, 401);
    const { data: userData } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
    const caller = userData.user;
    if (!caller) return json({ error: "Please sign in first." }, 401);

    const { action, email, role } = (await req.json()) ?? {};

    const { data: callerRoles } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", caller.id);
    const isSuperAdmin = (callerRoles ?? []).some((row) => row.role === "super_admin");
    if (!isSuperAdmin) return json({ error: "Only the super admin can manage team access." }, 403);

    if (action === "list") {
      const { data: roleRows } = await admin.from("user_roles").select("user_id, role");
      const { data: profiles } = await admin.from("profiles").select("id, email, full_name");
      const team = (roleRows ?? []).map((row) => {
        const profile = (profiles ?? []).find((item) => item.id === row.user_id);
        return {
          user_id: row.user_id,
          role: row.role,
          email: profile?.email ?? "",
          full_name: profile?.full_name ?? "",
        };
      });
      return json({ team });
    }

    if (!email || !role || !["admin", "super_admin"].includes(role)) {
      return json({ error: "Provide an email address and a role." }, 400);
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("id")
      .ilike("email", email)
      .maybeSingle();
    if (!profile) {
      return json(
        { error: "No account with that email yet. Ask them to create an account first." },
        404,
      );
    }

    if (action === "grant") {
      const { error } = await admin
        .from("user_roles")
        .upsert({ user_id: profile.id, role }, { onConflict: "user_id,role" });
      if (error) throw error;
      return json({ ok: true });
    }

    if (action === "revoke") {
      if (profile.id === caller.id && role === "super_admin") {
        return json({ error: "You cannot remove your own super admin access." }, 400);
      }
      const { error } = await admin
        .from("user_roles")
        .delete()
        .eq("user_id", profile.id)
        .eq("role", role);
      if (error) throw error;
      return json({ ok: true });
    }

    return json({ error: "Unknown action." }, 400);
  } catch (error) {
    console.error("manage-staff failed", error);
    return json({ error: "Something went wrong managing team access." }, 500);
  }
});
