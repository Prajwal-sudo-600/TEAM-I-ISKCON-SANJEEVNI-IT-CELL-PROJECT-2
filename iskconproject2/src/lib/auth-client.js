import { supabase } from "@/lib/supabase/client";

export async function getUserRoleClient() {
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error:", authError);
    return { success: false, role: null };
  }

  const { data, error } = await supabase
    .from("profiles") // ✅ FIXED
    .select("role")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("Role fetch error:", error);
    return { success: false, role: null };
  }

  return { success: true, role: data.role };
}
