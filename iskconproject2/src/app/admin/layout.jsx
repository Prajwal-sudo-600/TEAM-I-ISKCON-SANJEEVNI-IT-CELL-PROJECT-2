import { redirect } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import { isAdmin } from "@/lib/isAdmin";
import "./globals.css";

export default async function AdminLayout({ children }) {
  const admin = await isAdmin();

  // ❌ Not admin or not logged in → send to user dashboard
  if (!admin) {
    redirect("/users");
  }

  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
