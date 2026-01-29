import { supabase } from "@/lib/supabase/client";

export async function loginWithEmail(email, password) {
  const { data, error } =
    await supabase.auth.signInWithPassword({ email, password });

  if (error) throw error;
  return data;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
