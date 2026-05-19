"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { fetchWithToken } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiArrowUpRight,
  FiArrowDownLeft,
  FiX,
  FiCalendar,
} from "react-icons/fi";

import Pagination from "@/components/Pagination";
const PAGE_SIZE = 10;


interface Transaction {
  id: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
  category: { name: string };
  description: string;
  createdAt: string;
  balanceBefore: number;
  balanceAfter: number;
}
interface Category {
  id: string;
  name: string;
}

const fmtIDR = (n: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(n ?? 0);

// use NextAuth session token via fetchWithToken

const CATEGORY_ICON: Record<string, string> = {
  food: "🍜",
  transport: "🚗",
  crypto: "₿",
  gold: "🥇",
  salary: "💼",
  income: "💼",
  entertainment: "🎬",
  shopping: "🛍",
  health: "🏥",
  "top up": "📲",
  other: "📦",
};

// ── Modal Transaksi ───────────────────────────────────────────────
function TransactionModal({
  onClose,
  onSuccess,
  token,
}: {
  onClose: () => void;
  onSuccess: () => void;
  token: string;
}) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");

  useEffect(() => {
    if (!token) return;
    fetchWithToken(token, "/categories").then((data) => {
      if (Array.isArray(data)) setCategories(data);
    });
  }, [token]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const amount = Number(
      (form.elements.namedItem("amount") as HTMLInputElement).value,
    );
    const category = (form.elements.namedItem("category") as HTMLSelectElement)
      .value;
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value;
    try {
      const data = await fetchWithToken(token, "/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, type, category, description }),
      });
      // assume API returns error structure when failed
      onSuccess();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  // Shared input style — bg-white eksplisit agar tidak transparan
  const inputCls =
    "w-full px-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-semibold text-[14px]";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl shadow-blue-100/50 z-10"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-slate-800 font-black text-[18px]">
            Transaksi Baru
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Type toggle */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-50 rounded-2xl">
          {(["EXPENSE", "INCOME"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`flex-1 py-2.5 rounded-xl text-[13px] font-black transition-all ${
                type === t
                  ? t === "INCOME"
                    ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "bg-slate-800 text-white shadow-md shadow-slate-200"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {t === "INCOME" ? "💰 Income" : "💸 Expense"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[12px] text-slate-600 font-bold ml-1">
              Jumlah (Rp)
            </label>
            {/* FIX: bg-white eksplisit */}
            <input
              name="amount"
              type="number"
              min="1"
              required
              placeholder="100000"
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] text-slate-600 font-bold ml-1">
              Category
            </label>
            {/* FIX: bg-white eksplisit */}
            <select name="category" required className={inputCls}>
              <option value="">Choose Category...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[12px] text-slate-600 font-bold ml-1">
              Description
            </label>
            {/* FIX: bg-white eksplisit */}
            <input
              name="description"
              type="text"
              placeholder="Optional..."
              className={inputCls}
            />
          </div>
          <button
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <FiPlus strokeWidth={3} size={14} />
                Save Transaction
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function TransactionPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">(
    "ALL",
  );
  const [filterMonth, setFilterMonth] = useState("");
  const [page, setPage] = useState(1);

  const { data: session } = useSession();
  const token = (session?.user as any)?.accessToken ?? "";

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      if (!token) return;
      const data = await fetchWithToken(token, "/transactions");
      if (Array.isArray(data)) {
        setTransactions(data);
        setFiltered(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  // Filter logic — reset ke page 1 setiap filter berubah
  useEffect(() => {
    let result = [...transactions];
    if (filterType !== "ALL")
      result = result.filter((t) => t.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description?.toLowerCase().includes(q) ||
          t.category?.name?.toLowerCase().includes(q),
      );
    }
    if (filterMonth)
      result = result.filter((t) => t.createdAt.startsWith(filterMonth));
    setFiltered(result);
    setPage(1); // reset ke halaman pertama setiap filter berubah
  }, [search, filterType, filterMonth, transactions]);

  const totalIncome = filtered
    .filter((t) => t.type === "INCOME")
    .reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered
    .filter((t) => t.type === "EXPENSE")
    .reduce((s, t) => s + t.amount, 0);

  // Slice untuk halaman aktif
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <AnimatePresence>
        {showModal && (
          <TransactionModal
            token={token}
            onClose={() => setShowModal(false)}
            onSuccess={fetchTransactions}
          />
        )}
      </AnimatePresence>

      <div
        className="min-h-full bg-slate-50 px-4 py-6 sm:px-6 lg:px-8 xl:px-10"
        style={{
          fontFamily: "var(--font-sans, 'Plus Jakarta Sans', sans-serif)",
        }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex items-center justify-between mb-7"
          >
            <div>
              <h1 className="text-slate-800 text-[24px] font-black tracking-tight">
                Transaksi
              </h1>
              <p className="text-slate-400 text-[12px] font-mono mt-0.5">
                Riwayat semua transaksi kamu
              </p>
            </div>
            <motion.button
              onClick={() => setShowModal(true)}
              whileTap={{ scale: 0.94 }}
              className="flex items-center gap-2 bg-blue-600 text-white text-[13px] font-black px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors"
            >
              <FiPlus strokeWidth={3} size={14} />
              Transaksi Baru
            </motion.button>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {[
              {
                label: "Total Transaksi",
                value: filtered.length.toString(),
                icon: <FiFilter size={16} />,
                color: "text-slate-700",
                bg: "bg-white",
                iconBg: "bg-slate-100 text-slate-500",
              },
              {
                label: "Total Pemasukan",
                value: fmtIDR(totalIncome),
                icon: <FiArrowUpRight size={16} />,
                color: "text-blue-600",
                bg: "bg-blue-50",
                iconBg: "bg-blue-100 text-blue-600",
              },
              {
                label: "Total Pengeluaran",
                value: fmtIDR(totalExpense),
                icon: <FiArrowDownLeft size={16} />,
                color: "text-slate-700",
                bg: "bg-white",
                iconBg: "bg-slate-100 text-slate-500",
              },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`${item.bg} border border-slate-100 rounded-2xl p-5 flex items-center gap-4 shadow-sm`}
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg}`}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    {item.label}
                  </p>
                  <p className={`${item.color} text-[18px] font-black mt-0.5`}>
                    {item.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white border border-slate-100 rounded-2xl p-4 mb-4 flex flex-wrap gap-3 shadow-sm"
          >
            <div className="flex items-center gap-2 flex-1 min-w-[200px] px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <FiSearch size={13} className="text-slate-400 shrink-0" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari transaksi..."
                className="bg-transparent outline-none text-[13px] text-slate-700 placeholder:text-slate-400 font-medium w-full"
              />
            </div>

            <div className="flex gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
              {(["ALL", "INCOME", "EXPENSE"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                    filterType === t
                      ? "bg-white shadow-sm text-slate-800"
                      : "text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t === "ALL" ? "Semua" : t === "INCOME" ? "Masuk" : "Keluar"}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50">
              <FiCalendar size={13} className="text-slate-400" />
              <input
                type="month"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                className="bg-transparent outline-none text-[13px] text-slate-700 font-medium"
              />
              {filterMonth && (
                <button
                  onClick={() => setFilterMonth("")}
                  className="text-slate-400 hover:text-slate-600 ml-1"
                >
                  <FiX size={12} />
                </button>
              )}
            </div>
          </motion.div>

          {/* Transaction List */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
          >
            {loading ? (
              <div className="p-6 space-y-3">
                {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="w-40 h-3 bg-slate-100 rounded-lg animate-pulse" />
                      <div className="w-24 h-2.5 bg-slate-100 rounded-lg animate-pulse" />
                    </div>
                    <div className="w-28 h-4 bg-slate-100 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-5xl mb-4">🔍</div>
                <p className="text-slate-600 font-black text-[15px]">
                  Tidak ada transaksi
                </p>
                <p className="text-slate-400 text-[12px] font-mono mt-1">
                  Coba ubah filter atau tambah transaksi baru
                </p>
              </div>
            ) : (
              <>
                {/* Table header */}
                <div className="hidden md:grid grid-cols-[2fr_1fr_1fr_1fr_160px] gap-4 px-6 py-3 border-b border-slate-50">
                  {[
                    "Transaksi",
                    "Kategori",
                    "Tanggal",
                    "Saldo Akhir",
                    "Jumlah",
                  ].map((h, i) => (
                    <p
                      key={h}
                      className={`text-[10px] font-black uppercase tracking-widest text-slate-400 ${i === 4 ? "text-right" : ""}`}
                    >
                      {h}
                    </p>
                  ))}
                </div>

                <div className="divide-y divide-slate-50">
                  <AnimatePresence mode="wait">
                    {paginated.map((t, i) => {
                      const isIncome = t.type === "INCOME";
                      const cat = (t.category?.name ?? "other").toLowerCase();
                      return (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.015 }}
                          className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_160px] gap-4 items-center px-6 py-4 hover:bg-slate-50 transition-colors group"
                        >
                          {/* Transaksi */}
                          <div className="flex items-center gap-3 min-w-0">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center text-[17px] shrink-0 ${isIncome ? "bg-blue-100" : "bg-slate-100"}`}
                            >
                              {CATEGORY_ICON[cat] ?? (isIncome ? "💰" : "💸")}
                            </div>
                            <div className="min-w-0">
                              <p className="text-slate-700 text-[13px] font-bold truncate group-hover:text-blue-600 transition-colors">
                                {t.description || t.category?.name}
                              </p>
                              <p className="text-slate-400 text-[10px] font-mono md:hidden capitalize">
                                {t.category?.name} ·{" "}
                                {new Date(t.createdAt).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Kategori */}
                          <p className="hidden md:block text-slate-500 text-[12px] font-semibold capitalize">
                            {t.category?.name}
                          </p>

                          {/* Tanggal */}
                          <p className="hidden md:block text-slate-400 text-[11px] font-mono">
                            {new Date(t.createdAt).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>

                          {/* Saldo akhir */}
                          <p className="hidden md:block text-slate-500 text-[12px] font-mono">
                            {fmtIDR(t.balanceAfter)}
                          </p>

                          {/* Jumlah + badge */}
                          <div className="flex items-center gap-2 justify-end">
                            <p
                              className={`text-[14px] font-black font-mono shrink-0 ${isIncome ? "text-blue-600" : "text-slate-700"}`}
                            >
                              {isIncome ? "+" : "−"}
                              {fmtIDR(Math.abs(t.amount))}
                            </p>
                            <span
                              className={`hidden lg:inline shrink-0 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                isIncome
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {isIncome ? "Masuk" : "Keluar"}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>

                {/* Pagination */}
                <Pagination
                  total={filtered.length}
                  page={page}
                  pageSize={PAGE_SIZE}
                  onChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
