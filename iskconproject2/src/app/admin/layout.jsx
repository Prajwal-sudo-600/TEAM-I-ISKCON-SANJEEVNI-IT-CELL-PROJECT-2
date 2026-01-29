import { redirect } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import { getUser } from "@/lib/getUser";
import { isAdmin } from "@/lib/isAdmin";
import "./globals.css";


export default async function AdminLayout({ children }) {
  const user = await getUser();

  // Not logged in → go to login
  if (!user) {
    redirect("/login");
  }

  const admin = await isAdmin();

  // Logged in but NOT admin → send to users dashboard
  if (!admin) {
    redirect("/users");
  }

  

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
