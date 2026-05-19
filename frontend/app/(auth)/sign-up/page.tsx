"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      // register tidak return access_token, redirect ke sign-in
      alert(data.message);
      router.push("/sign-in");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white selection:bg-indigo-100">
      {/* LEFT SIDE */}
      <div className="relative hidden lg:flex flex-col items-start justify-between bg-[#0F172A] p-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full animate-bounce" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xl">FT</span>
          </div>
          <span className="text-white font-bold text-2xl tracking-tight">FinTrack</span>
        </div>

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

          <div className="mt-12 space-y-6">
            {[
              "Institutional-grade security",
              "Real-time market analytics",
              "Multi-asset portfolio management",
            ].map((text, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-300 font-medium">
                <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" />
                </div>
                {text}
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 FinTrack Inc. All rights reserved.
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex flex-col items-center justify-center p-8 lg:p-24 relative">
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
              Create an account
            </h2>
            <p className="text-slate-500 mt-3 font-medium">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="text-indigo-600 hover:text-indigo-700 font-bold underline underline-offset-4"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-700 font-bold ml-1">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold shadow-sm"
              />
            </div>

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
              <label className="text-sm text-slate-700 font-bold ml-1">
                Password
              </label>
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
              className="w-full py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </main>
  );
}