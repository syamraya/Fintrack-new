"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpPage() {
  const router = useRouter();

  const [step, setStep] = useState<"register" | "verify">("register");

  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registrasi gagal");
      }

      alert(data.message || "OTP berhasil dikirim!");

      setStep("verify");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan";

      alert(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      alert("OTP wajib diisi");
      return;
    }

    setOtpLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_API_URL}/auth/verify-register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            otp,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verifikasi gagal");
      }

      alert("Akun berhasil diverifikasi!");

      router.push("/sign-in");
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan";

      alert(message);
    } finally {
      setOtpLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white overflow-hidden">
      {/* LEFT */}
      <div className="relative hidden lg:flex flex-col items-start justify-between bg-[#0F172A] p-12 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />

        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-violet-600/20 blur-[100px] rounded-full animate-bounce" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-black text-xl">FT</span>
          </div>

          <span className="text-white font-bold text-2xl tracking-tight">
            FinTrack
          </span>
        </div>

        <div className="relative z-10 max-w-lg">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white leading-[1.1] tracking-tight"
          >
            Secure your <br />
            <span className="text-indigo-400">financial future.</span>
          </motion.h1>

          <p className="mt-6 text-slate-400 text-lg leading-relaxed font-medium">
            Real-time portfolio tracking, institutional-grade analytics,
            and AI-powered financial insights.
          </p>

          <div className="mt-12 space-y-6">
            {[
              "Real-time market analytics",
              "AI financial assistant",
              "Bank-level security",
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

        <div className="relative z-10 text-slate-500 text-sm font-medium">
          © 2026 FinTrack Inc.
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-8 lg:p-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <AnimatePresence mode="wait">
            {step === "register" ? (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-10">
                  <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                    Create account
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

                <form
                  onSubmit={handleRegister}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <label className="text-sm text-slate-700 font-bold ml-1">
                      Full Name
                    </label>

                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-700 font-bold ml-1">
                      Email Address
                    </label>

                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold shadow-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-slate-700 font-bold ml-1">
                      Password
                    </label>

                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-semibold shadow-sm"
                    />
                  </div>

                  <button
                    disabled={isLoading}
                    className="w-full py-4 rounded-2xl font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Continue"
                    )}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="verify"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <div className="mb-10">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-100 flex items-center justify-center mb-6">
                    <span className="text-2xl">✉️</span>
                  </div>

                  <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    Verify your email
                  </h2>

                  <p className="text-slate-500 mt-4 font-medium leading-relaxed">
                    We sent a 6-digit verification code to
                    <span className="font-bold text-slate-900">
                      {" "}{formData.email}
                    </span>
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-700 font-bold ml-1">
                      Verification Code
                    </label>

                    <input
                      type="text"
                      maxLength={6}
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full px-5 py-5 rounded-2xl border border-slate-200 bg-white text-center tracking-[10px] text-2xl font-black text-slate-900 placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all shadow-sm"
                    />
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={otpLoading}
                    className="w-full py-4 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {otpLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      "Verify Account"
                    )}
                  </button>

                  <button
                    onClick={() => setStep("register")}
                    className="w-full text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    Back
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </main>
  );
}