"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBarChart2, 
  FiList, 
  FiUser, 
  FiSend, 
  FiLogOut, 
  FiActivity, 
  FiGrid, 
  FiChevronRight, 
  FiX 
} from "react-icons/fi";
import { useState, useEffect } from "react";
import RequireAuth from "../../components/RequireAuth";
import { useAuth } from "../../context/AuthContext";
import { loadUserProfile } from "../../lib/userProfileStorage";
import { EthiopianClock, UnifiedProfileDropdown } from "../../components/dashboard/DashboardShellShared";

const TABS = [
  { href: "/dashboard", label: "Overview", icon: FiBarChart2, exact: true },
  { href: "/dashboard/history", label: "Trip History", icon: FiList },
  { href: "/dashboard/profile", label: "Settings & Profile", icon: FiUser },
  { href: "/dashboard/activity", label: "Activity Log", icon: FiClock },
  { href: "/dashboard/admin", label: "Mission Request", icon: FiSend },
];

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const profileSnap = user?.email ? loadUserProfile(user.email) : null;
  const displayName = profileSnap?.fullName || user?.name || user?.username || "Traveler";
  const avatarSrc = profileSnap?.profilePhoto;

  const router = typeof window !== 'undefined' ? require('next/navigation').useRouter() : null;

  useEffect(() => {
    if (user?.role === 'admin' && router) {
      router.replace('/admin/dashboard');
    }
  }, [user, router]);

  const currentTab = TABS.find((t) =>
    t.exact ? pathname === t.href : pathname.startsWith(t.href)
  ) || TABS[0];

  return (
    <RequireAuth>
      <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
        
        {/* ── Top bar ── */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileSidebarOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--panel)] text-[var(--text-primary)] md:hidden"
            >
              <FiGrid size={18} />
            </button>

            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-green text-[10px] font-bold text-white shadow-lg">
                ET
              </span>
              <span className="hidden lg:inline text-sm font-bold tracking-tight">EthioTravel</span>
            </Link>

            <div className="hidden items-center gap-1 text-sm text-[var(--text-muted)] md:flex">
              <FiChevronRight size={14} />
              <span className="font-medium text-[var(--text-secondary)]">{currentTab.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <EthiopianClock />
            <UnifiedProfileDropdown />
          </div>
        </header>

        <div className="flex flex-1">
          {/* ── Sidebar ── */}
          <aside className="hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] md:flex">
            <div className="border-b border-[var(--border)] p-5 text-center">
              <div className="flex flex-col items-center">
                <div className="group relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-[var(--border)] bg-white/5 shadow-xl transition hover:border-blue-500/50 overflow-hidden">
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  ) : (
                    <div className="text-3xl font-black text-white/10">{displayName.charAt(0).toUpperCase()}</div>
                  )}
                  <div className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-emerald-500" />
                </div>
                <h2 className="mt-4 text-sm font-black tracking-tight text-[var(--text-primary)]">{displayName}</h2>
                <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-[10px] font-black tracking-widest text-blue-400 uppercase">
                  <FiActivity size={10} /> {user?.role || "Traveler"}
                </div>
              </div>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-3">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
                return (
                  <Link
                    key={t.href}
                    href={t.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-widest transition-all ${
                      active
                        ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/20"
                        : "text-[var(--text-secondary)] hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Icon size={16} />
                    {t.label}
                    {active && <FiChevronRight size={14} className="ml-auto opacity-60" />}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-[var(--border)] p-3">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-black uppercase tracking-widest text-red-500 transition hover:bg-red-500/10"
              >
                <FiLogOut size={16} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {mobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-40 bg-black/60 md:hidden"
                  onClick={() => setMobileSidebarOpen(false)}
                />
                <motion.aside
                  initial={{ x: -280 }}
                  animate={{ x: 0 }}
                  exit={{ x: -280 }}
                  transition={{ type: "spring", damping: 25 }}
                  className="fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-[var(--border)] bg-[var(--bg)] md:hidden flex"
                >
                  <div className="flex items-center justify-between border-b border-[var(--border)] p-4">
                    <p className="font-bold text-[var(--text-primary)] text-sm uppercase tracking-widest">Navigation</p>
                    <button onClick={() => setMobileSidebarOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                      <FiX size={20} />
                    </button>
                  </div>
                  <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                    {TABS.map((t) => {
                      const Icon = t.icon;
                      const active = t.exact ? pathname === t.href : pathname.startsWith(t.href);
                      return (
                        <Link
                          key={t.href}
                          href={t.href}
                          onClick={() => setMobileSidebarOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-4 text-xs font-black uppercase tracking-widest transition ${
                            active
                              ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg"
                              : "text-[var(--text-secondary)] hover:bg-[var(--panel)]"
                          }`}
                        >
                          <Icon size={16} />
                          {t.label}
                        </Link>
                      );
                    })}
                  </nav>
                  <div className="border-t border-[var(--border)] p-3">
                    <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-500/10">
                      <FiLogOut size={16} /> Sign Out
                    </button>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <main className="flex-1 overflow-x-hidden p-4 md:p-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RequireAuth>
  );
}
