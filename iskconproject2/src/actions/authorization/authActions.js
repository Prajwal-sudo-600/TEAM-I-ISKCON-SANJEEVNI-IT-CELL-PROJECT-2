"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin"; // Import Admin Client


export async function signUpUser(formdata) {
  const supabase = await createSupabaseServerClient();
  const supabaseAdmin = createSupabaseAdmin(); // Initialize Admin Client

  const { fullName, email, contactNumber, address, password } = formdata;


  const { data: authData, error: authError } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: contactNumber,
          address: address,
        },
      },
    });

  if (authError) throw new Error(authError.message);

  const userId = authData.user.id;


  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .insert({
      id: userId,
      full_name: fullName,
      phone: contactNumber,
      address: address,
      role: "user", // default
    });

  if (profileError) throw new Error(profileError.message);

  return { success: true };
}


export async function getUserRole() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    console.error("Auth error:", authError);
    return { success: false, role: null };
  }

  // Try fetching profile
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 🔴 Profile missing → auto-create
  if (error && error.code === "PGRST116") {
    const supabaseAdmin = createSupabaseAdmin(); // Admin for bypass

    console.log("Profile missing for user, checking admin creation...");

    const { data: newProfile, error: insertError } = await supabaseAdmin
      .from("profiles")
      .insert({
        id: user.id,
        role: "user",
        full_name: user.user_metadata?.full_name || "Unknown User",
        phone: user.user_metadata?.phone,
        department: user.user_metadata?.department,
      })
      .select("role")
      .single();

    if (insertError) {
      console.error("Profile auto-create failed:", insertError);
      return { success: false, role: null };
    }

    return { success: true, role: newProfile.role };
  }

  if (error) {
    console.error("Role fetch error:", error);
    return { success: false, role: null };
  }

  return { success: true, role: data.role };
}
