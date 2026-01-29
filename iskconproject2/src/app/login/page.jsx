"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { loginWithEmail } from "@/lib/auth";


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
      await loginWithEmail(email, password);

      // ✅ redirect after successful login
      router.push("/users");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fbd0b8] via-[#fcbfa0] to-[#f9aa80]">
      <div className="bg-white/25 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl p-10 w-full max-w-md
        transition-all duration-300 hover:scale-[1.03] hover:shadow-3xl hover:bg-white/30">

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
            className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-12 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-500 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-600 transition transform hover:scale-105 shadow-lg disabled:opacity-70"
          >
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-700">
          Don’t have an account?{" "}
          <Link
            href="/register"
            className="text-orange-600 font-semibold hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
