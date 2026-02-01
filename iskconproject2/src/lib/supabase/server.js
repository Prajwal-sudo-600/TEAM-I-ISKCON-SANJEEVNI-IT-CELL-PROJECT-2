import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createSupabaseServerClient(options = {}) {
  const cookieStore = await cookies();

  const supabaseKey = options.admin
    ? process.env.SUPABASE_SERVICE_ROLE_KEY // 🔑 ADMIN
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY; // 👤 USER

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
