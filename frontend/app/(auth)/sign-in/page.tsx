"use client";

// ─────────────────────────────────────────────────────────────────
//  FinTrack — Sign In Page (NextAuth CredentialsProvider)
//  Path: app/(auth)/sign-in/page.tsx
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FiUser, FiLock, FiArrowLeft, FiTrendingUp } from "react-icons/fi";

export default function SignInPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/dashboard";

  const [email,     setEmail]     = useState("");
  const [password,  setPassword]  = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah. Silakan coba lagi.");
        return;
      }

      if (result?.ok) {
        // Fetch session untuk cek role, lalu redirect
        const sessionRes = await fetch("/api/auth/session");
        const session    = await sessionRes.json();
        const role       = session?.user?.role;

        router.push(role === "ADMIN" ? "/admin/dashboard" : callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan koneksi. Pastikan server aktif.");
    } finally {
      setIsLoading(false);
    }
  }

  const inputCls =
    "w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400 transition-all text-slate-800 placeholder:text-slate-300 font-medium text-[14px]";

  return (
    <div
      className="min-h-screen bg-slate-50 flex overflow-hidden"
      style={{ fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)" }}
    >
      {/* ── Left panel — branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
            <span className="text-white font-black text-[13px]">FT</span>
          </div>
          <span className="text-white font-black text-[20px] tracking-tight">
            Fin<span className="text-blue-200">Track</span>
          </span>
        </div>

        {/* Center copy */}
        <div className="relative">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-3 py-1.5 mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
            <span className="text-white/90 text-[11px] font-bold uppercase tracking-widest">Live Market · 150+ Aset</span>
          </div>
          <h2 className="text-white text-[40px] font-black leading-[1.08] tracking-tight mb-5">
            Pantau semua<br />asetmu dari<br />
            <span className="text-blue-200">satu tempat.</span>
          </h2>
          <p className="text-blue-200 text-[15px] leading-relaxed max-w-[340px] font-medium">
            Harga crypto & emas real-time, berita keuangan terkini, dan wallet — semua terintegrasi di FinTrack.
          </p>
        </div>

        {/* Mini stats */}
        <div className="relative grid grid-cols-3 gap-3">
          {[
            { label: "Pengguna Aktif",   value: "2.4M+"   },
            { label: "Volume Transaksi", value: "Rp 18T+" },
            { label: "Uptime",           value: "99.9%"   },
          ].map((s) => (
            <div key={s.label} className="bg-white/10 border border-white/15 rounded-xl p-3">
              <p className="text-white font-black text-[18px] tracking-tight leading-none">{s.value}</p>
              <p className="text-blue-200 text-[10px] font-bold uppercase tracking-wider mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ────────────────────────────────── */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-12 lg:px-16 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)", backgroundSize: "28px 28px", opacity: 0.5 }} />

        <div className="relative w-full max-w-[420px] mx-auto">

          {/* Back */}
          <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-10 font-semibold text-sm group">
            <FiArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Beranda
          </a>

          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
              <span className="text-white font-black text-[12px]">FT</span>
            </div>
            <span className="text-slate-900 font-black text-[17px] tracking-tight">
              Fin<span className="text-blue-600">Track</span>
            </span>
          </div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <h1 className="text-slate-900 text-[30px] font-black tracking-tight leading-tight">
              Masuk ke akun<br />
              <span className="text-blue-600">FinTrack</span> kamu
            </h1>
            <p className="text-slate-400 text-[14px] font-medium mt-2">
              Belum punya akun?{" "}
              <a href="/sign-up" className="text-blue-600 font-bold hover:underline">Daftar gratis</a>
            </p>
          </motion.div>

          {/* Error alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-[13px] font-semibold flex items-center gap-2"
            >
              <span>⚠</span> {error}
            </motion.div>
          )}

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5"
          >
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Email</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  placeholder="nama@email.com"
                  className={inputCls}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={16} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="••••••••"
                  className={inputCls}
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <div className="flex justify-end -mt-2">
              <a href="#" className="text-[12px] text-slate-400 hover:text-blue-600 font-semibold transition-colors">Lupa password?</a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-[14px] shadow-md shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <>Masuk Sekarang <FiTrendingUp size={15} /></>}
            </button>
          </motion.form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-slate-300 text-[12px] font-semibold">live data</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Mini ticker */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
            className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between gap-2 shadow-sm"
          >
            {[
              { sym: "BTC",  val: "$67,420", up: true  },
              { sym: "ETH",  val: "$3,512",  up: true  },
              { sym: "GOLD", val: "$2,318",  up: true  },
              { sym: "IHSG", val: "7,284",   up: false },
            ].map((t) => (
              <div key={t.sym} className="text-center flex-1 min-w-0">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">{t.sym}</p>
                <p className="text-slate-800 text-[11px] font-black">{t.val}</p>
                <p className={`text-[9px] font-bold ${t.up ? "text-emerald-500" : "text-red-400"}`}>{t.up ? "▲" : "▼"}</p>
              </div>
            ))}
            <div className="text-slate-300 text-[10px] font-mono border-l border-slate-100 pl-3 shrink-0 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse inline-block" />
              Live
            </div>
          </motion.div>

          <p className="text-center text-slate-300 text-[11px] font-medium mt-8">
            © 2026 FinTrack. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

