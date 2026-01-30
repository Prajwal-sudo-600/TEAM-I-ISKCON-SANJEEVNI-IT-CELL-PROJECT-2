import { getUser } from "@/lib/getUser";

// CHANGE THIS EMAIL TO YOUR ADMIN EMAIL
const ADMIN_EMAIL = "apanandgaonkar@gmail.com";

export async function isAdmin() {
  const user = await getUser();

  if (!user) return false;

  return user.email === ADMIN_EMAIL;
}