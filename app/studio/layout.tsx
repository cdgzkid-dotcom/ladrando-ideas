"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/studio/login";

  // Skip auth check on login page
  if (isLogin) {
    return <>{children}</>;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const { authenticated, checking } = useAuth();

  if (checking) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-bg-alt sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="/studio"
              className="font-display text-lg font-bold text-primary tracking-tight"
            >
              LADRANDO IDEAS
            </a>
            <span className="text-text-ter text-sm hidden sm:inline">
              Studio — Guiones
            </span>
          </div>
          <a
            href="/studio/nuevo"
            className="bg-primary text-white px-4 py-2 rounded-lg text-xs font-bold hover:brightness-110 transition-all"
          >
            + Nuevo guion
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
