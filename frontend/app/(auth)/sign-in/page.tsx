"use client";

// ─────────────────────────────────────────────────────────────────
//  FinTrack — Sign In Page
//  Path: app/sign-in/page.tsx
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { storeCookie } from "@/lib/client-cookies";
import { Lock, User, ArrowLeft, Loader2, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignInPage() {
  const [username, setUsername]   = useState<string>("");
  const [password, setPassword]   = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const request = JSON.stringify({ username, password });
      const url     = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "APP-KEY": `${process.env.NEXT_PUBLIC_APP_KEY}`,
        },
        body: request,
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast.error(responseData.message || "Gagal masuk. Silakan cek kembali data Anda.");
        setIsLoading(false);
        return;
      }

      storeCookie("token", responseData.token, 1);
      storeCookie("role", responseData.role, 1);

      toast.success("Login berhasil! Selamat datang kembali.");

      setTimeout(() => {
        if (responseData.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else {
          router.push("/customer/dashboard");
        }
      }, 1200);
    } catch (error) {
      console.error("Error during sign in:", error);
      toast.error("Terjadi kesalahan koneksi. Pastikan server aktif.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">

      {/* ── Left panel — branding ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 flex-col justify-between p-12 relative overflow-hidden">

        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,.6) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Soft glow blob */}
        <div
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-32 -left-32 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.08) 0%, transparent 70%)" }}
        />

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
            <span className="text-white/90 text-[11px] font-bold uppercase tracking-widest">
              Live Market · 150+ Aset
            </span>
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
            { label: "Pengguna Aktif", value: "2.4M+" },
            { label: "Volume Transaksi", value: "Rp 18T+" },
            { label: "Uptime", value: "99.9%" },
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

        {/* Subtle bg dot grid for right panel */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.5,
          }}
        />

        <div className="relative w-full max-w-[420px] mx-auto">

          {/* Back button */}
          <a
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-10 font-semibold text-sm group"
          >
            <ArrowLeft
              size={16}
              className="group-hover:-translate-x-1 transition-transform"
            />
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
          <div className="mb-8">
            <h1 className="text-slate-900 text-[30px] font-black tracking-tight leading-tight">
              Masuk ke akun<br />
              <span className="text-blue-600">FinTrack</span> kamu
            </h1>
            <p className="text-slate-400 text-[14px] font-medium mt-2">
              Belum punya akun?{" "}
              <a href="/sign-up" className="text-blue-600 font-bold hover:underline">
                Daftar gratis
              </a>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSignIn} className="space-y-5">

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Username
              </label>
              <div className="relative group">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                  size={17}
                />
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-slate-800 placeholder:text-slate-300 font-medium text-[14px]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors"
                  size={17}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-slate-800 placeholder:text-slate-300 font-medium text-[14px]"
                  required
                />
              </div>
            </div>

            {/* Lupa password */}
            <div className="flex justify-end">
              <a href="#" className="text-[13px] text-slate-400 hover:text-blue-600 font-semibold transition-colors">
                Lupa password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-bold text-[14px] shadow-md shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk Sekarang
                  <TrendingUp size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-7">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-slate-300 text-[12px] font-semibold">atau</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          {/* Mini ticker preview */}
          <div className="bg-white border border-slate-100 rounded-xl px-4 py-3 flex items-center justify-between gap-2 overflow-hidden">
            {[
              { sym: "BTC", val: "$67,420", up: true  },
              { sym: "ETH", val: "$3,512",  up: true  },
              { sym: "GOLD", val: "$2,318", up: true  },
              { sym: "IHSG", val: "7,284",  up: false },
            ].map((t) => (
              <div key={t.sym} className="text-center flex-1 min-w-0">
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider truncate">{t.sym}</p>
                <p className="text-slate-800 text-[11px] font-black truncate">{t.val}</p>
                <p className={`text-[9px] font-bold ${t.up ? "text-emerald-500" : "text-red-400"}`}>
                  {t.up ? "▲" : "▼"}
                </p>
              </div>
            ))}
            <div className="text-slate-300 text-[10px] font-mono border-l border-slate-100 pl-3 shrink-0">
              Live
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-300 text-[11px] font-medium mt-10">
            © 2026 FinTrack. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}