"use client";

// ─────────────────────────────────────────────────────────────────
//  FinTrack — Landing Page (Revamp: Modern Light Mode)
//  Path: app/page.tsx
//
//  Fonts — tambahkan di app/layout.tsx:
//    import { Sora, JetBrains_Mono } from "next/font/google"
//    const sora = Sora({ subsets: ["latin"], variable: "--font-sans" })
//    const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })
//    <body className={`${sora.variable} ${mono.variable} font-sans`}>
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Icons ────────────────────────────────────────────────────────
const IconChart = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);
const IconGold = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
  </svg>
);
const IconWallet = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
    <path d="M16 3H8L4 7h16l-4-4z" />
    <circle cx="17" cy="14" r="1" fill="currentColor" />
  </svg>
);
const IconNews = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
    <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
  </svg>
);
const IconShield = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IconBolt = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);
const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// ── Data ─────────────────────────────────────────────────────────
const TICKERS = [
  { label: "BTC/USD",   value: "$67,420",  change: "+2.4%",  up: true  },
  { label: "ETH/USD",   value: "$3,512",   change: "+1.8%",  up: true  },
  { label: "Gold/oz",   value: "$2,318",   change: "+0.6%",  up: true  },
  { label: "IHSG",      value: "7,284",    change: "−0.3%",  up: false },
  { label: "SOL/USD",   value: "$183",     change: "+4.1%",  up: true  },
  { label: "Silver/oz", value: "$29.40",   change: "−0.2%",  up: false },
  { label: "BNB/USD",   value: "$598",     change: "+1.1%",  up: true  },
  { label: "XAU/IDR",   value: "Rp 1.14M", change: "+0.7%", up: true  },
];

const FEATURES = [
  { icon: <IconChart />,  title: "Grafik Real-Time",      desc: "Pantau pergerakan harga aset favoritmu dengan grafik interaktif yang diperbarui setiap detik.",                     color: "blue"   },
  { icon: <IconGold />,   title: "Harga Emas & Crypto",   desc: "Harga emas, perak, Bitcoin, Ethereum, dan ratusan aset lain dalam satu tampilan terintegrasi.",                     color: "amber"  },
  { icon: <IconNews />,   title: "Berita Keuangan",       desc: "Berita pasar terkini dari sumber terpercaya, dikurasi khusus sesuai aset yang kamu pantau.",                        color: "violet" },
  { icon: <IconWallet />, title: "Wallet & Transaksi",    desc: "Beli, jual, dan simpan aset digital langsung dari dashboard. Multi-chain, satu tempat.",                           color: "emerald"},
  { icon: <IconShield />, title: "Keamanan Terjamin",     desc: "Enkripsi end-to-end dan autentikasi dua faktor menjaga asetmu tetap aman setiap saat.",                            color: "blue"   },
  { icon: <IconBolt />,   title: "Eksekusi Cepat",        desc: "Order tereksekusi dalam milidetik. Tidak ada lag, tidak ada missed opportunity.",                                  color: "orange" },
];

const STATS = [
  { value: "2.4M+",   label: "Pengguna Aktif"  },
  { value: "Rp 18T+", label: "Volume Transaksi" },
  { value: "150+",    label: "Aset Tersedia"    },
  { value: "99.9%",   label: "Uptime"           },
];

const TESTIMONIALS = [
  { name: "Andi Pratama",    role: "Trader Crypto",     text: "FinTrack ngebantu banget buat pantau semua aset di satu tempat. UI-nya bersih dan cepet banget." },
  { name: "Sari Dewi",       role: "Investor Emas",     text: "Fitur berita keuangannya keren, langsung tau kalau ada pergerakan pasar yang penting." },
  { name: "Budi Santoso",    role: "Portfolio Manager", text: "Eksekusi ordernya nggak pernah lag. Ini yang aku cari selama ini dari platform lokal." },
];

const FEATURE_COLORS: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  blue:    { bg: "bg-blue-50",    border: "border-blue-100",    text: "text-blue-700",    icon: "text-blue-500"    },
  amber:   { bg: "bg-amber-50",   border: "border-amber-100",   text: "text-amber-700",   icon: "text-amber-500"   },
  violet:  { bg: "bg-violet-50",  border: "border-violet-100",  text: "text-violet-700",  icon: "text-violet-500"  },
  emerald: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", icon: "text-emerald-500" },
  orange:  { bg: "bg-orange-50",  border: "border-orange-100",  text: "text-orange-700",  icon: "text-orange-500"  },
};

// ── Sparkline ────────────────────────────────────────────────────
function Sparkline({ up }: { up: boolean }) {
  const color = up ? "#10b981" : "#ef4444";
  const path  = up
    ? "M0,20 C10,18 20,10 30,12 C40,14 50,6 60,4 C70,2 80,8 90,5 C95,3 98,2 100,0"
    : "M0,0 C10,2 20,8 30,6 C40,4 50,12 60,14 C70,16 80,10 90,16 C95,18 98,19 100,20";
  return (
    <svg width="72" height="24" viewBox="0 0 100 20" fill="none">
      <path d={path} stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

// ── Ticker Bar ───────────────────────────────────────────────────
function TickerBar() {
  return (
    <div className="w-full overflow-hidden bg-slate-900 border-b border-slate-800">
      <div className="flex animate-[ticker_28s_linear_infinite] w-max">
        {[...TICKERS, ...TICKERS].map((t, i) => (
          <div key={i} className="flex items-center gap-2 px-5 py-2 border-r border-slate-800 whitespace-nowrap">
            <span className="text-slate-500 text-[10px] font-mono font-bold tracking-widest uppercase">{t.label}</span>
            <span className="text-white text-[11px] font-mono font-semibold">{t.value}</span>
            <span className={`text-[10px] font-mono font-bold ${t.up ? "text-emerald-400" : "text-red-400"}`}>{t.change}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes ticker{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────
function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-white border-b border-slate-100"}`}>
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
            <span className="text-white font-black text-[12px] tracking-tight">FT</span>
          </div>
          <span className="text-slate-900 font-black text-[17px] tracking-tight">
            Fin<span className="text-blue-600">Track</span>
          </span>
        </div>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-7">
          {["Fitur", "Harga Aset", "Berita", "Tentang"].map((l) => (
            <a key={l} href="#" className="text-slate-500 text-[13px] font-semibold hover:text-slate-900 transition-colors">
              {l}
            </a>
          ))}
        </div>

        {/* Buttons */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => router.push("/sign-in")}
            className="text-slate-600 text-[13px] font-semibold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Masuk
          </button>
          <button
            onClick={() => router.push("/sign-in")}
            className="bg-blue-600 text-white text-[13px] font-bold px-5 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            Daftar Gratis
          </button>
        </div>

        <button className="md:hidden text-slate-700 p-1" onClick={() => setOpen(!open)}>
          {open ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-5 flex flex-col gap-4 animate-[fadeIn_.15s_ease]">
          {["Fitur", "Harga Aset", "Berita", "Tentang"].map((l) => (
            <a key={l} href="#" className="text-slate-600 text-[14px] font-semibold hover:text-slate-900">{l}</a>
          ))}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => router.push("/sign-in")}
              className="flex-1 border border-slate-200 text-slate-700 text-[13px] font-semibold py-2.5 rounded-lg hover:bg-slate-50"
            >
              Masuk
            </button>
            <button
              onClick={() => router.push("/sign-in")}
              className="flex-1 bg-blue-600 text-white text-[13px] font-bold py-2.5 rounded-lg hover:bg-blue-700"
            >
              Daftar
            </button>
          </div>
        </div>
      )}
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────
function Hero() {
  const router = useRouter();
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Subtle dot grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #e2e8f0 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.6,
        }}
      />
      {/* Soft color blob */}
      <div
        className="absolute top-[-80px] left-1/2 -translate-x-1/2 w-[800px] h-[500px] pointer-events-none rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.07) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-blue-600 text-[11px] font-black uppercase tracking-widest">Platform Keuangan #1 Indonesia</span>
        </div>

        <h1 className="text-[52px] md:text-[68px] font-black leading-[1.0] tracking-[-3px] mb-6 text-slate-900">
          Kelola Asetmu,
          <br />
          <span className="text-blue-600">Satu Dashboard.</span>
        </h1>

        <p className="text-slate-500 text-[16px] md:text-[17px] leading-relaxed max-w-[520px] mx-auto mb-10 font-medium">
          Pantau harga emas & crypto, baca berita keuangan terkini, dan kelola wallet aset digital — semua dalam satu platform yang powerful.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16">
          <button
            onClick={() => router.push("/sign-in")}
            className="flex items-center gap-2 bg-blue-600 text-white font-bold text-[14px] px-8 py-3.5 rounded-xl hover:bg-blue-700 active:scale-[.98] transition-all shadow-md shadow-blue-200"
          >
            Mulai Gratis Sekarang <IconArrow />
          </button>
          <a href="#fitur" className="flex items-center gap-2 text-slate-600 font-semibold text-[14px] px-6 py-3.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
            Lihat Fitur
          </a>
        </div>

        <DashboardPreview />
      </div>
    </section>
  );
}

// ── Dashboard Preview ─────────────────────────────────────────────
function DashboardPreview() {
  return (
    <div className="relative max-w-3xl mx-auto rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xl shadow-slate-200/60">
      {/* Browser bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50">
        <div className="w-3 h-3 rounded-full bg-red-300" />
        <div className="w-3 h-3 rounded-full bg-amber-300" />
        <div className="w-3 h-3 rounded-full bg-emerald-300" />
        <span className="ml-3 text-slate-400 text-[11px] font-mono">fintrack.id/dashboard</span>
      </div>

      <div className="p-5 grid grid-cols-3 gap-3 bg-slate-50/50">
        {/* Portfolio card */}
        <div className="col-span-2 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Total Portfolio</p>
          <p className="text-slate-900 text-[26px] font-black tracking-tight leading-none">Rp 48.250.000</p>
          <p className="text-emerald-500 text-[11px] font-bold mt-1 mb-3">↑ +Rp 1.240.000 hari ini (+2.6%)</p>
          <div className="flex items-end gap-1 h-10">
            {[38, 52, 44, 68, 58, 78, 62, 88, 72, 96].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all"
                style={{
                  height: `${h}%`,
                  background: i === 9 ? "#2563eb" : `rgba(59,130,246,${0.1 + i * 0.07})`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Asset cards */}
        <div className="flex flex-col gap-3">
          {[
            { sym: "BTC", price: "$67,420", chg: "+2.4%", up: true },
            { sym: "GOLD", price: "$2,318", chg: "+0.6%", up: true },
          ].map((a) => (
            <div key={a.sym} className="bg-white rounded-xl border border-slate-100 p-3 shadow-sm">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">{a.sym}</p>
              <p className="text-slate-900 text-[13px] font-black">{a.price}</p>
              <p className={`text-[10px] font-bold ${a.up ? "text-emerald-500" : "text-red-500"}`}>{a.chg}</p>
              <Sparkline up={a.up} />
            </div>
          ))}
        </div>

        {/* News preview */}
        <div className="col-span-3 bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-3">Berita Terkini</p>
          <div className="flex flex-col gap-2.5">
            {[
              { tag: "Crypto", tagColor: "bg-blue-50 text-blue-600",  title: "Bitcoin Tembus $67K Setelah Laporan Inflasi AS Mereda" },
              { tag: "Emas",   tagColor: "bg-amber-50 text-amber-600", title: "Harga Emas Dunia Menguat Didorong Ketidakpastian Geopolitik" },
            ].map((n, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md ${n.tagColor}`}>{n.tag}</span>
                <span className="text-slate-600 text-[11px] font-semibold truncate">{n.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────
function StatsBar() {
  return (
    <section className="bg-blue-600">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-0">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`text-center py-4 ${i < STATS.length - 1 ? "border-r border-blue-500/40" : ""}`}
          >
            <p className="text-white text-[32px] md:text-[38px] font-black tracking-tight leading-none">{s.value}</p>
            <p className="text-blue-200 text-[11px] font-bold uppercase tracking-wider mt-2">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────
function Features() {
  return (
    <section id="fitur" className="bg-slate-50 py-24">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="text-blue-600 text-[11px] font-black uppercase tracking-widest mb-3">Kenapa FinTrack?</p>
          <h2 className="text-[36px] md:text-[48px] font-black tracking-tight text-slate-900 leading-tight">
            Semua yang kamu butuhkan,
            <br />
            <span className="text-blue-600">dalam satu platform.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const c = FEATURE_COLORS[f.color] ?? FEATURE_COLORS.blue;
            return (
              <div
                key={f.title}
                className="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-200 hover:-translate-y-1 hover:shadow-md hover:shadow-blue-50 transition-all cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-5 ${c.bg} ${c.icon} border ${c.border}`}>
                  {f.icon}
                </div>
                <h3 className="text-slate-900 text-[15px] font-black mb-2">{f.title}</h3>
                <p className="text-slate-500 text-[13px] leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="bg-white py-20 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-center text-blue-600 text-[11px] font-black uppercase tracking-widest mb-3">Kata Mereka</p>
        <h2 className="text-center text-slate-900 text-[32px] md:text-[40px] font-black tracking-tight mb-12">
          Dipercaya jutaan pengguna
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="bg-slate-50 border border-slate-100 rounded-2xl p-6 hover:border-blue-100 transition-colors">
              <p className="text-blue-500 text-[22px] font-black mb-3">"</p>
              <p className="text-slate-600 text-[13px] leading-relaxed font-medium mb-5">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center">
                  <span className="text-blue-600 text-[12px] font-black">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-slate-900 text-[13px] font-black">{t.name}</p>
                  <p className="text-slate-400 text-[11px] font-medium">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────
function CTA() {
  const router = useRouter();
  return (
    <section className="bg-slate-50 py-24 border-t border-slate-100">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="relative bg-blue-600 rounded-3xl px-8 py-16 overflow-hidden">
          {/* Subtle dot pattern */}
          <div
            className="absolute inset-0 pointer-events-none opacity-10"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,.5) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative">
            <p className="text-blue-200 text-[11px] font-black uppercase tracking-widest mb-4">Mulai Sekarang</p>
            <h2 className="text-white text-[36px] md:text-[52px] font-black tracking-tight leading-tight mb-5">
              Siap mengelola
              <br />asetmu dengan cerdas?
            </h2>
            <p className="text-blue-200 text-[15px] font-medium max-w-[400px] mx-auto mb-10">
              Daftar gratis dalam 30 detik. Tidak perlu kartu kredit.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => router.push("/sign-in")}
                className="flex items-center gap-2 bg-white text-blue-600 font-black text-[14px] px-10 py-3.5 rounded-xl hover:bg-blue-50 active:scale-[.98] transition-all shadow-md"
              >
                Daftar Gratis <IconArrow />
              </button>
              <button
                onClick={() => router.push("/sign-in")}
                className="text-blue-100 font-bold text-[14px] px-8 py-3.5 rounded-xl border border-white/25 hover:bg-white/10 transition-colors"
              >
                Sudah punya akun? Masuk
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-black text-[11px]">FT</span>
          </div>
          <span className="text-white font-black text-[15px]">
            Fin<span className="text-blue-400">Track</span>
          </span>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {["Privasi", "Syarat & Ketentuan", "Bantuan", "Kontak"].map((l) => (
            <a key={l} href="#" className="text-slate-500 text-[12px] font-semibold hover:text-slate-300 transition-colors">
              {l}
            </a>
          ))}
        </div>
        <p className="text-slate-600 text-[12px] font-mono">© 2026 FinTrack. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div className="bg-white min-h-screen" style={{ fontFamily: "var(--font-sans, sans-serif)" }}>
      <TickerBar />
      <Navbar />
      <Hero />
      <StatsBar />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}