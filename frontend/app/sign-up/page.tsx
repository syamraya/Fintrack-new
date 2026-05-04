"use client";

import { useState } from "react";
import { 
  Droplets, 
  Lock, 
  User, 
  Phone, 
  UserPlus, 
  ArrowLeft, 
  Loader2,
  Eye,
  EyeOff 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function SignUpPage() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const request = JSON.stringify({ username, password, name, phone });
      const url = `${process.env.NEXT_PUBLIC_BASE_API_URL}/admins`;
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
        toast.error(responseData.message || "Gagal melakukan registrasi");
        setIsLoading(false);
        return;
      }

      toast.success("Registrasi Berhasil! Silakan masuk.");
      
      // Beri jeda agar user bisa baca toast sebelum pindah ke login
      setTimeout(() => {
        router.push("/sign-in");
      }, 1500);

    } catch (error) {
      console.error("Error during sign up:", error);
      toast.error("Terjadi kesalahan koneksi ke server.");
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 -z-10 w-1/2 h-1/2 bg-blue-50 rounded-full blur-3xl opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 -z-10 w-1/2 h-1/2 bg-cyan-50 rounded-full blur-3xl opacity-50 transform translate-x-1/2 translate-y-1/2"></div>

      <div className="w-full max-w-[500px] animate-in fade-in zoom-in duration-500">
        {/* Back Link */}
        <a 
          href="/sign-in" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-6 font-semibold text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Sudah punya akun? Login
        </a>

        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200 mb-4">
              <UserPlus className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Daftar <span className="text-blue-600">Admin</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 text-center">
              Lengkapi data di bawah untuk membuat akun Fintrack.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSignUp}>
            {/* Input Name */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 font-medium text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input Username */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">
                  Username
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 font-medium text-sm"
                    required
                  />
                </div>
              </div>

              {/* Input Phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">
                  Nomor HP
                </label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="text"
                    placeholder="0812..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 font-medium text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-[0.1em] text-slate-400 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Buat password kuat"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-50 border border-slate-100 rounded-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all text-slate-800 placeholder:text-slate-300 font-medium text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-[20px] font-bold shadow-lg shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                "Buat Akun Sekarang"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
             <p className="text-xs text-slate-400 leading-relaxed">
               Dengan mendaftar, Anda menyetujui <br /> 
               <span className="font-bold text-slate-500 underline cursor-pointer">Syarat & Ketentuan</span> Aplikasi Fintrack.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}