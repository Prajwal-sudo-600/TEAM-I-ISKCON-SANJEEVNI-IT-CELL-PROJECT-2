"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#fbd0b8] via-[#fcbfa0] to-[#f9aa80]">

      {/* Glass Card */}
      <div className="bg-white/25 backdrop-blur-xl border border-white/30 shadow-2xl rounded-3xl px-8 py-6 w-full max-w-md transition transform hover:scale-105 duration-300">

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4 text-center">
          Create Account
        </h2>

        <form className="space-y-2">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          <input
            type="tel"
            placeholder="Contact Number"
            className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
          />

          {/* Address */}
          <textarea
            placeholder="Address"
            rows="2"
            className="w-full px-4 py-2 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-orange-300 resize-none overflow-hidden"
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = e.target.scrollHeight + "px";
            }}
          ></textarea>

          {/* Password Input with Eye Icon */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 pr-12 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-500 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Confirm Password Input with Eye Icon */}
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="w-full px-4 py-2 pr-12 rounded-lg bg-white/60 border border-white focus:outline-none focus:ring-2 focus:ring-orange-300"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(prev => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-500 transition"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-2 rounded-lg text-white font-semibold bg-gradient-to-r from-orange-300 to-orange-500 hover:from-orange-400 hover:to-orange-600 transition transform hover:scale-105 shadow-lg"
          >
            REGISTER
          </button>
        </form>

        <p className="text-center mt-3 text-gray-700 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-600 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
