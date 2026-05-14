"use client";

// ─────────────────────────────────────────────────────────────────
//  📁 FILE: app/dashboard/page.tsx
//  🖥️  TYPE: FRONTEND (Next.js Client Component)
//
//  Tema    : Biru-Putih, full screen
//  Layout  : Bento grid (sidebar sudah di layout.tsx)
//
//  Endpoint BE:
//    GET /users/me                    → nama, balance (JWT)
//    GET /transactions/stats          → income, expense (JWT)
//    GET /transactions                → list transaksi (JWT)
//    GET /market/gold-price           → harga emas
//    GET /market/crypto?coin=bitcoin  → harga BTC
//    GET /market/crypto?coin=ethereum → harga ETH
//    GET /market/news                 → berita (JWT)
//
//  Install: npm install framer-motion react-icons recharts
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  FiArrowUpRight, FiArrowDownLeft, FiEye, FiEyeOff,
  FiPlus, FiRefreshCw, FiExternalLink, FiCreditCard,
  FiTrendingUp, FiTrendingDown,
} from "react-icons/fi";
import { SiBitcoin, SiEthereum } from "react-icons/si";

// ── Config ────────────────────────────────────────────────────────
const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

// ── Types ─────────────────────────────────────────────────────────
interface User        { id: string; name: string; email: string; balance: number; role: string }
interface Stats       { totalIncome: number; totalExpense: number; transactionCount: number }
interface Transaction {
  id: string; amount: number; type: "INCOME" | "EXPENSE";
  category: string; description: string; createdAt: string;
}
interface GoldPrice  { price: number; high: number; low: number; isMock?: boolean }
interface CryptoData { symbol: string; price_usd: number; change_24h: number }
interface NewsItem   { id: number; headline: string; source: string; url: string; datetime: number }

// ── Helpers ───────────────────────────────────────────────────────
const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0);

const fmtUSD = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(n ?? 0);

const timeAgo = (ts: number | string) => {
  const diff = Date.now() / 1000 - (typeof ts === "string" ? new Date(ts).getTime() / 1000 : ts);
  if (diff < 3600)  return `${Math.floor(diff / 60)}m lalu`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}j lalu`;
  return `${Math.floor(diff / 86400)}h lalu`;
};

const CATEGORY_ICON: Record<string, string> = {
  food: "🍜", transport: "🚗", crypto: "₿", gold: "🥇",
  salary: "💼", income: "💼", entertainment: "🎬",
  shopping: "🛍", health: "🏥", "top up": "📲", other: "📦",
};

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("access_token") ?? "" : "";

const authFetch = (url: string) =>
  fetch(`${API}${url}`, { headers: { Authorization: `Bearer ${getToken()}` } }).then((r) => r.json());

// ── Skeleton ──────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl bg-blue-50 ${className}`} />;
}

// ── Chart Tooltip ─────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-blue-100 rounded-2xl px-3 py-2 text-[11px] shadow-xl shadow-blue-100/60">
      <p className="text-slate-400 mb-1 font-mono font-bold">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-black">
          {p.name === "income" ? "Masuk" : "Keluar"}: {fmtIDR(p.value)}
        </p>
      ))}
    </div>
  );
}

// ── Bento Card ────────────────────────────────────────────────────
function Card({
  children, className = "", delay = 0,
}: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
//  WIDGET 1 — Chart Arus Kas (col-span-7)
// ─────────────────────────────────────────────────────────────────
function CashflowChart({ transactions }: { transactions: Transaction[] }) {
  const monthly = (() => {
    const map: Record<string, { month: string; income: number; expense: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString("id-ID", { month: "short" });
      map[key] = { month: key, income: 0, expense: 0 };
    }
    transactions.forEach((t) => {
      const key = new Date(t.createdAt).toLocaleString("id-ID", { month: "short" });
      if (!map[key]) return;
      if (t.type === "INCOME")  map[key].income  += t.amount;
      if (t.type === "EXPENSE") map[key].expense += t.amount;
    });
    return Object.values(map);
  })();

  return (
    <Card delay={0} className="p-6 col-span-12 lg:col-span-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-slate-800 font-black text-[15px]">Arus Kas</p>
          <p className="text-slate-400 text-[11px] font-mono mt-0.5">6 bulan terakhir</p>
        </div>
        <div className="flex gap-4 text-[11px] font-bold">
          <span className="flex items-center gap-1.5 text-blue-500">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />Pemasukan
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-blue-200 inline-block" />Pengeluaran
          </span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="flex items-end gap-2 h-[160px]">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="flex-1" style={{ height: `${40 + i * 20}px` } as any} />
          ))}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={monthly} barSize={16} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="month"
              tick={{ fill: "#94a3b8", fontSize: 10, fontFamily: "monospace" }}
              axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: "rgba(59,130,246,0.04)", radius: 8 }} />
            <Bar dataKey="income"  fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="expense" fill="#bfdbfe" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────
//  WIDGET 2 — User Card + Visa (col-span-5)
// ─────────────────────────────────────────────────────────────────
function UserCard({ user, stats }: { user: User | null; stats: Stats | null }) {
  const [show, setShow] = useState(false);

  return (
    <Card delay={0.06} className="p-6 col-span-12 lg:col-span-5 flex flex-col gap-4">
      {/* User info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-200">
            <span className="text-white font-black text-[15px]">
              {user?.name?.[0]?.toUpperCase() ?? "?"}
            </span>
          </div>
          <div>
            {user ? (
              <>
                <p className="text-slate-800 font-black text-[14px] leading-tight">{user.name}</p>
                <p className="text-slate-400 text-[10px] font-mono">{user.email}</p>
              </>
            ) : (
              <><Skeleton className="w-28 h-3.5 mb-1.5" /><Skeleton className="w-36 h-2.5" /></>
            )}
          </div>
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
          {user?.role ?? "USER"}
        </span>
      </div>

      {/* Visa card */}
      <div className="relative w-full rounded-2xl p-5 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #60a5fa 100%)",
          minHeight: "128px",
        }}>
        <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-white/10" />
        <div className="absolute -bottom-6 -left-4 w-24 h-24 rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-blue-200 text-[9px] font-mono uppercase tracking-widest mb-0.5">Saldo Utama</p>
              <div className="flex items-center gap-2">
                {user ? (
                  <p className="text-white text-[20px] font-black tracking-tight">
                    {show ? fmtIDR(user.balance) : "Rp ••••••••"}
                  </p>
                ) : <Skeleton className="w-36 h-6 bg-white/20" />}
                <button onClick={() => setShow(!show)} className="text-blue-200 hover:text-white transition-colors mt-0.5">
                  {show ? <FiEyeOff size={12} /> : <FiEye size={12} />}
                </button>
              </div>
            </div>
            <FiCreditCard className="text-white/40" size={20} />
          </div>

          <div className="flex items-end justify-between mt-5">
            <div>
              <p className="text-blue-200/60 text-[9px] font-mono uppercase tracking-widest">Nama</p>
              <p className="text-white/80 text-[12px] font-bold tracking-widest uppercase">
                {user?.name ?? "──────"}
              </p>
            </div>
            <p className="text-white/60 text-[13px] font-black italic tracking-widest">VISA</p>
          </div>
        </div>
      </div>

      {/* Income / Expense */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-3.5 bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-1.5 mb-1">
            <FiArrowUpRight size={11} className="text-blue-600" />
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Pemasukan</p>
          </div>
          {stats
            ? <p className="text-blue-600 text-[15px] font-black">{fmtIDR(stats.totalIncome)}</p>
            : <Skeleton className="w-24 h-4" />}
        </div>
        <div className="rounded-2xl p-3.5 bg-slate-50 border border-slate-100">
          <div className="flex items-center gap-1.5 mb-1">
            <FiArrowDownLeft size={11} className="text-slate-500" />
            <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest">Pengeluaran</p>
          </div>
          {stats
            ? <p className="text-slate-700 text-[15px] font-black">{fmtIDR(stats.totalExpense)}</p>
            : <Skeleton className="w-24 h-4" />}
        </div>
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────
//  WIDGET 3 — Analisa Pengeluaran (col-span-4)
// ─────────────────────────────────────────────────────────────────
function SpendingAnalysis({ transactions }: { transactions: Transaction[] }) {
  const expenses = transactions.filter((t) => t.type === "EXPENSE");
  const total    = expenses.reduce((s, t) => s + t.amount, 0);
  const byCategory = expenses.reduce<Record<string, number>>((acc, t) => {
    const key = (t.category ?? "other").toLowerCase();
    acc[key] = (acc[key] ?? 0) + t.amount;
    return acc;
  }, {});
  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const COLORS  = ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe", "#dbeafe"];

  return (
    <Card delay={0.1} className="p-6 col-span-12 lg:col-span-4">
      <p className="text-slate-800 font-black text-[15px] mb-1">Analisa Pengeluaran</p>
      <p className="text-slate-400 text-[11px] font-mono mb-5">Per kategori bulan ini</p>

      {sorted.length === 0 ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-9 w-full" />)}</div>
      ) : (
        <div className="space-y-4">
          {sorted.map(([cat, val], i) => {
            const pct = total ? (val / total) * 100 : 0;
            return (
              <div key={cat}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[12px] font-bold text-slate-600 flex items-center gap-1.5 capitalize">
                    {CATEGORY_ICON[cat] ?? "📦"} {cat}
                  </span>
                  <span className="text-[11px] font-black text-slate-500 font-mono">
                    {pct.toFixed(0)}%
                  </span>
                </div>
                <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ background: COLORS[i] ?? "#3b82f6" }}
                  />
                </div>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{fmtIDR(val)}</p>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────
//  WIDGET 4 — Berita (col-span-5)
// ─────────────────────────────────────────────────────────────────
function NewsWidget({ news }: { news: NewsItem[] }) {
  return (
    <Card delay={0.14} className="p-6 col-span-12 lg:col-span-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-slate-800 font-black text-[15px]">Berita Pasar</p>
          <p className="text-slate-400 text-[11px] font-mono">Terkini</p>
        </div>
        <a href="/news" className="text-blue-500 text-[11px] font-bold hover:underline flex items-center gap-1">
          Semua <FiExternalLink size={10} />
        </a>
      </div>

      {news.length === 0 ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <Skeleton className="w-10 h-10 shrink-0 rounded-xl" />
              <div className="flex-1 space-y-2"><Skeleton className="h-3 w-full" /><Skeleton className="h-2.5 w-2/3" /></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {news.slice(0, 4).map((n) => (
            <a key={n.id} href={n.url} target="_blank" rel="noopener noreferrer"
              className="flex gap-3 group rounded-2xl p-2 -mx-2 hover:bg-blue-50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-[14px]">📰</div>
              <div className="flex-1 min-w-0">
                <p className="text-slate-700 text-[12px] font-bold leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {n.headline}
                </p>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-slate-400 text-[10px] font-mono">{n.source}</span>
                  <span className="text-slate-300 text-[10px]">·</span>
                  <span className="text-slate-400 text-[10px] font-mono">{timeAgo(n.datetime)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────
//  WIDGET 5 — Harga Emas & Crypto (col-span-3)
// ─────────────────────────────────────────────────────────────────
function PriceWidget({ gold, btc, eth }: { gold: GoldPrice | null; btc: CryptoData | null; eth: CryptoData | null }) {
  const items = [
    { label: "Emas / oz", value: gold ? fmtUSD(gold.price) : null, change: null,           sub: gold ? `H: ${fmtUSD(gold.high)}` : null, icon: "🥇" },
    { label: "Bitcoin",   value: btc  ? fmtUSD(btc.price_usd) : null, change: btc?.change_24h ?? null, sub: null, icon: <SiBitcoin className="text-[#f7931a]" size={14} /> },
    { label: "Ethereum",  value: eth  ? fmtUSD(eth.price_usd) : null, change: eth?.change_24h ?? null, sub: null, icon: <SiEthereum className="text-[#627eea]" size={14} /> },
  ];

  return (
    <Card delay={0.18} className="p-6 col-span-12 lg:col-span-3">
      <p className="text-slate-800 font-black text-[15px] mb-1">Harga Aset</p>
      <p className="text-slate-400 text-[11px] font-mono mb-5">Live market</p>

      <div className="space-y-3">
        {items.map((item) => {
          const up = (item.change ?? 0) >= 0;
          return (
            <div key={item.label} className="rounded-2xl p-3.5 bg-slate-50 border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-6 h-6 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[12px]">
                  {item.icon}
                </div>
                <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              </div>
              {item.value ? (
                <>
                  <p className="text-slate-800 text-[15px] font-black font-mono">{item.value}</p>
                  {item.change != null && (
                    <p className={`text-[10px] font-bold flex items-center gap-1 mt-0.5 ${up ? "text-blue-500" : "text-slate-400"}`}>
                      {up ? <FiTrendingUp size={10} /> : <FiTrendingDown size={10} />}
                      {Math.abs(item.change).toFixed(2)}%
                    </p>
                  )}
                  {item.sub && <p className="text-slate-400 text-[9px] font-mono mt-0.5">{item.sub}</p>}
                </>
              ) : <Skeleton className="w-24 h-5 mt-1" />}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────
//  WIDGET 6 — Transaksi Terakhir (col-span-12)
// ─────────────────────────────────────────────────────────────────
function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <Card delay={0.22} className="p-6 col-span-12">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-slate-800 font-black text-[15px]">Transaksi Terakhir</p>
          <p className="text-slate-400 text-[11px] font-mono">Riwayat aktivitas</p>
        </div>
        <a href="/transactions" className="text-blue-500 text-[11px] font-bold hover:underline flex items-center gap-1">
          Lihat Semua <FiExternalLink size={10} />
        </a>
      </div>

      {transactions.length === 0 ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2"><Skeleton className="w-40 h-3" /><Skeleton className="w-24 h-2.5" /></div>
              <Skeleton className="w-24 h-4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {transactions.slice(0, 8).map((t) => {
            const isIncome = t.type === "INCOME";
            const cat      = (t.category ?? "other").toLowerCase();
            return (
              <motion.div
                key={t.id}
                whileHover={{ x: 3 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-3.5 px-3 py-3 rounded-2xl hover:bg-blue-50 transition-colors group cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-[17px] shrink-0 ${isIncome ? "bg-blue-100" : "bg-slate-100"}`}>
                  {CATEGORY_ICON[cat] ?? (isIncome ? "💰" : "💸")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-[13px] font-bold truncate group-hover:text-blue-600 transition-colors">
                    {t.description || t.category}
                  </p>
                  <p className="text-slate-400 text-[10px] font-mono capitalize">
                    {t.category} · {new Date(t.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <p className={`text-[13px] font-black font-mono shrink-0 ${isIncome ? "text-blue-600" : "text-slate-600"}`}>
                  {isIncome ? "+" : "−"}{fmtIDR(Math.abs(t.amount))}
                </p>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

// ─────────────────────────────────────────────────────────────────
//  MAIN PAGE
// ─────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [user,         setUser]         = useState<User | null>(null);
  const [stats,        setStats]        = useState<Stats | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [gold,         setGold]         = useState<GoldPrice | null>(null);
  const [btc,          setBtc]          = useState<CryptoData | null>(null);
  const [eth,          setEth]          = useState<CryptoData | null>(null);
  const [news,         setNews]         = useState<NewsItem[]>([]);
  const [refreshing,   setRefreshing]   = useState(false);
  const [lastUpdate,   setLastUpdate]   = useState("");

  const fetchAll = async () => {
    setRefreshing(true);
    try {
      const [u, s, tx, g, b, e, n] = await Promise.allSettled([
        authFetch("/users/me"),
        authFetch("/transactions/stats"),
        authFetch("/transactions"),
        fetch(`${API}/market/gold-price`).then((r) => r.json()),
        fetch(`${API}/market/crypto?coin=bitcoin`).then((r) => r.json()),
        fetch(`${API}/market/crypto?coin=ethereum`).then((r) => r.json()),
        authFetch("/market/news"),
      ]);
      if (u.status  === "fulfilled") setUser(u.value);
      if (s.status  === "fulfilled") setStats(s.value);
      if (tx.status === "fulfilled") setTransactions(Array.isArray(tx.value) ? tx.value : []);
      if (g.status  === "fulfilled") setGold(g.value);
      if (b.status  === "fulfilled") setBtc(b.value);
      if (e.status  === "fulfilled") setEth(e.value);
      if (n.status  === "fulfilled") setNews(Array.isArray(n.value) ? n.value : []);
      setLastUpdate(new Date().toLocaleTimeString("id-ID"));
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-7"
      style={{ fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)" }}>
      <div className="max-w-[1100px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-slate-800 text-[22px] font-black tracking-tight">
              Halo, <span className="text-blue-600">{user?.name?.split(" ")[0] ?? "..."}</span> 👋
            </h1>
            <p className="text-slate-400 text-[12px] font-mono mt-0.5">
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {lastUpdate && ` · ${lastUpdate}`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={fetchAll}
              whileTap={{ scale: 0.92 }}
              className="flex items-center gap-2 border border-slate-200 text-slate-400 text-[12px] font-bold px-4 py-2.5 rounded-xl hover:border-blue-300 hover:text-blue-500 transition-all bg-white"
            >
              <FiRefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-2 bg-blue-600 text-white text-[13px] font-black px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
            >
              <FiPlus strokeWidth={3} size={14} />
              Transaksi Baru
            </motion.button>
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-4">
          <CashflowChart transactions={transactions} />
          <UserCard user={user} stats={stats} />
          <SpendingAnalysis transactions={transactions} />
          <NewsWidget news={news} />
          <PriceWidget gold={gold} btc={btc} eth={eth} />
          <TransactionList transactions={transactions} />
        </div>

      </div>
    </div>
  );
}