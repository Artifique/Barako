import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser();
  if (authError || !user) redirect("/auth/connexion?next=/admin");
  const { data: profile, error } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (error || !profile || profile.role !== "admin") redirect("/");
}
