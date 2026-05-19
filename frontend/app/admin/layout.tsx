// ─────────────────────────────────────────────────────────────────
//  📁 FILE: app/admin/layout.tsx
//  🖥️  TYPE: FRONTEND (Next.js Layout)
//
//  Layout admin — pakai Sidebar yang sama,
//  proteksi role dilakukan di page.tsx masing-masing.
// ─────────────────────────────────────────────────────────────────

import Sidebar from "@/components/sidebarAdmin";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-slate-50">
        {children}
      </main>
    </div>
  );
}