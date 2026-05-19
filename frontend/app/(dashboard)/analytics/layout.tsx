// ─────────────────────────────────────────────────────────────────
//  📁 FILE: app/dashboard/layout.tsx
//  🖥️  TYPE: FRONTEND (Next.js Layout)
//
//  Pasang Sidebar di sini — semua halaman di dalam /dashboard
//  otomatis dapat sidebar tanpa perlu import satu-satu.
//
//  Struktur folder:
//    app/
//      dashboard/
//        layout.tsx          ← file ini
//        page.tsx            ← dashboard utama
//        transactions/
//          page.tsx          ← otomatis dapat sidebar
//        analytics/
//          page.tsx          ← otomatis dapat sidebar
//        ...
// ─────────────────────────────────────────────────────────────────

import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar — fixed di kiri, tidak ikut scroll */}
      <Sidebar />

      {/* Konten utama — scroll di dalam sini */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}