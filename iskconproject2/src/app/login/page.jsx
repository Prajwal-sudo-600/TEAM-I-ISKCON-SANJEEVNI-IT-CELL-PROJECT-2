"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginWithEmail } from "@/lib/auth";
import { getUserRole } from "@/actions/authActions"; // ✅ Switch to Server Action

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Login
      await loginWithEmail(email, password);

      // 2️⃣ Get role (SERVER ACTION - ROBUST)
      const roleRes = await getUserRole();

      console.log("ROLE RESPONSE:", roleRes); // 🔥 ADD THIS


      if (!roleRes.success) {
        alert("Unable to determine user role");
        return;
      }

      // 3️⃣ Redirect
      if (roleRes.role === "admin") {
        router.replace("/admin");
      } else {
        router.replace("/users");
      }

    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fbd0b8] via-[#fcbfa0] to-[#f9aa80]">
      <div className="bg-white/25 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md">

        <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          HARE KRISHNA 🌸
        </h2>

        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg bg-white/60 border"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-12 rounded-lg bg-white/60 border"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-orange-500 text-white"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <p className="text-center mt-4">
          Don’t have an account?{" "}
          <Link href="/register" className="text-orange-600">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
