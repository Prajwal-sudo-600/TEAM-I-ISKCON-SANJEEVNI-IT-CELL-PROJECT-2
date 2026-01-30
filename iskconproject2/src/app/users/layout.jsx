import { Analytics } from "@vercel/analytics/next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/getUser";
import "./globals.css";

export const metadata = {
  title: "ISKCON Sanjeevani IT Cell - Room & Resource Allocation",
  description:
    "Official internal digital seva platform for ISKCON Sanjeevani IT Cell room booking and resource management",
};

export default async function UsersLayout({ children }) {
  const user = await getUser();

  // 🔐 PROTECT ALL /users ROUTES
  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {children}
      <Analytics />
    </>
  );
}
