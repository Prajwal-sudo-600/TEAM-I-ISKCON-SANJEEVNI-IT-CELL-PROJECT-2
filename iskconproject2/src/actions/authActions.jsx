"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signUpUser(formdata) {
  const supabase = await createSupabaseServerClient();

  const { fullName, email, contactNumber, address, password } = formdata;

  const { data: authData, error: authError } =
    await supabase.auth.signUp({ email, password });

  if (authError) throw new Error(authError.message);

  const userId = authData?.user?.id;

  const { error: profileError } = await supabase.from("users").insert({
    id: userId,
    full_name: fullName,
    email,
    contact_number: contactNumber,
    address,
    role: "user",
  });

  if (profileError) throw new Error(profileError.message);

  return { success: true };
}
