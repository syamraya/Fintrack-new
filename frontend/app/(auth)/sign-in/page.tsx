"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      localStorage.setItem("token", data.access_token);

      router.push("/dashboard");
    } catch {
      alert("Login gagal. Periksa kembali email dan password Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-indigo-100">
      {/* LEFT SIDE: BRANDING & PREVIEW */}
      <div className="relative hidden lg:flex flex-col items-start justify-between bg-[#0F172A] p-12 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full animate-bounce" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xl">FT</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">
            FinTrack
          </span>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white leading-[1.1] tracking-tight"
          >
            The future of <br />
            <span className="text-indigo-400">wealth tracking</span> is here.
          </motion.h1>
          <p className="mt-6 text-slate-400 text-lg leading-relaxed font-medium">
            Join 2.4M+ users who manage their portfolio with real-time data, AI
            insights, and institutional-grade security.
          </p>

          {/* Social Proof/Features */}
          <div className="mt-12 space-y-6">
            {[
              "Institutional-grade security",
              "Real-time market analytics",
              "Multi-asset portfolio management",
            ].map((text, i) => (
              <div
                key={i}
                className="flex items-center gap-3 text-slate-300 font-medium"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 FinTrack Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 relative">
        {/* Mobile Logo Only */}
        <div className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white font-black text-sm">FT</span>
          </div>
          <span className="font-bold text-xl">FinTrack</span>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Welcome back
            </h2>
            <p className="text-slate-500 mt-3 font-medium">
              New to FinTrack?{" "}
              <Link
                href="/sign-up"
                className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4"
              >
                Create an account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-700 font-bold ml-1">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="name@company.com"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm text-slate-700 font-bold">
                  Password
                </label>
                <Link
                  href="#"
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold shadow-sm"
              />
            </div>

            <button
              disabled={isLoading}
              className="w-full py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Sign in to Dashboard"
              )}
            </button>
          </form>

          {/* Social Login Separator */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-4 text-slate-400 font-bold tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          <button className="w-full py-4 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-all font-bold text-slate-700 flex items-center justify-center gap-3">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </button>
        </motion.div>
      </div>
    </main>
  );
}
