"use client";

import { motion } from "framer-motion";   
import { 
  FiPlus, 
  FiArrowUpRight, 
  FiArrowDownLeft, 
  FiPieChart, 
  FiDollarSign, 
  FiTrendingUp 
} from "react-icons/fi";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 lg:p-8">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 font-medium">Selamat datang kembali, Andhika!</p>
        </div>
        
        <button className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-indigo-200 transition-all active:scale-95">
          <FiPlus className="stroke-[3]" />
          <span>Transaksi Baru</span>
        </button>
      </header>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Saldo" 
          amount="Rp 12.450.000" 
          icon={<FiDollarSign className="text-indigo-600" />} 
          color="bg-indigo-50"
          trend="+2.5% bulan ini"
        />
        <StatCard 
          title="Pemasukan" 
          amount="Rp 8.200.000" 
          icon={<FiArrowUpRight className="text-emerald-600" />} 
          color="bg-emerald-50"
          trend="Bulan Mei"
        />
        <StatCard 
          title="Pengeluaran" 
          amount="Rp 3.750.000" 
          icon={<FiArrowDownLeft className="text-rose-600" />} 
          color="bg-rose-50"
          trend="Bulan Mei"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT TRANSACTIONS (Sesuai endpoint /transactions) */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-slate-900">Transaksi Terakhir</h3>
            <button className="text-sm font-bold text-indigo-600 hover:underline">Lihat Semua</button>
          </div>
          
          <div className="space-y-4">
            {/* Contoh Item Transaksi sesuai schema Postman: amount, type, category, description */}
            <TransactionItem 
              title="Gaji Bulanan" 
              category="Income" 
              amount="+ Rp 7.000.000" 
              type="INCOME" 
              date="12 Mei 2026"
            />
            <TransactionItem 
              title="Isi saldo buat jajan" 
              category="Top Up" 
              amount="- Rp 50.000" 
              type="EXPENSE" 
              date="11 Mei 2026"
            />
            <TransactionItem 
              title="Langganan Netflix" 
              category="Entertainment" 
              amount="- Rp 180.000" 
              type="EXPENSE" 
              date="10 Mei 2026"
            />
          </div>
        </div>

        {/* ANALYTICS / CATEGORY SUMMARY */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <FiPieChart className="text-slate-400 text-2xl" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Analisis Kategori</h3>
          <p className="text-slate-500 text-sm mt-2">Grafik pengeluaran kamu akan muncul di sini setelah ada lebih banyak data.</p>
          <div className="mt-6 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-[70%] h-full bg-indigo-500 rounded-full" />
          </div>
          <div className="flex justify-between w-full mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>Food</span>
            <span>70%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SUB-COMPONENTS */

function StatCard({ title, amount, icon, color, trend }: any) {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100"
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center text-xl`}>
          {icon}
        </div>
        <span className="text-slate-500 font-bold text-sm uppercase tracking-wider">{title}</span>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-black text-slate-900">{amount}</span>
        <span className="text-xs font-bold text-slate-400 mt-1 italic">{trend}</span>
      </div>
    </motion.div>
  );
}

function TransactionItem({ title, category, amount, type, date }: any) {
  const isIncome = type === "INCOME";
  return (
    <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${isIncome ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
          {isIncome ? <FiTrendingUp /> : <FiArrowDownLeft />}
        </div>
        <div>
          <h4 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{title}</h4>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">{category} • {date}</p>
        </div>
      </div>
      <span className={`font-black ${isIncome ? 'text-emerald-600' : 'text-slate-900'}`}>
        {amount}
      </span>
    </div>
  );
}