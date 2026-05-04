"use client";

import { useState } from "react";
import { storeCookie } from "@/lib/client-cookies";
import { Droplets, Lock, User, ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignAppPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const request = JSON.stringify({ username, password });
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth`;
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

      // Simpan Token ke Cookie jika berhasil
      storeCookie("token", responseData.token, 1);
      storeCookie('role', responseData.role, 1);

      // Notifikasi Berhasil
      toast.success("Login Berhasil! Selamat datang kembali.");

      // Delay sedikit agar user bisa melihat pesan sukses sebelum pindah halaman
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
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 -z-10 w-1/2 h-1/2 bg-blue-50 rounded-full blur-3xl opacity-50 transform translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/2 h-1/2 bg-cyan-50 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-[450px] animate-in fade-in zoom-in duration-500">
        <a 
          href="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-8 font-semibold text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </a>

        <div className="bg-white p-10 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 mb-4">
              <Droplets className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Selamat <span className="text-blue-600">Datang</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-medium">Silakan masuk ke akun PDAM Pintar Anda</p>
          </div>

          <form className="space-y-6" onSubmit={handleSignIn}>
            <div className="space-y-2">
              <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Username
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[12px] font-black uppercase tracking-widest text-slate-400 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-[20px] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 font-medium"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-blue-600 text-white py-4 rounded-[20px] font-bold shadow-xl shadow-slate-200 hover:shadow-blue-200 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Memproses...
                </>
              ) : (
                "Masuk Sekarang"
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center space-y-3">
            <p className="text-sm text-slate-500 font-medium">
              Belum punya akun? 
              <a href="/sign-up" className="text-blue-600 font-bold ml-1 hover:underline">
                Daftar Gratis
              </a>
            </p>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-xs mt-8 font-medium">
          &copy; 2026 Fintrack.
        </p>
      </div>
    </div>
  );
}