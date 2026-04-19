"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiChevronRight,
  FiGrid,
  FiInbox,
  FiLayers,
  FiLogOut,
  FiMap,
  FiSend,
  FiSettings,
  FiShield,
  FiUsers,
  FiX,
  FiActivity,
  FiSun,
  FiMoon,
  FiGlobe,
  FiChevronDown,
  FiClock,
} from "react-icons/fi";
import { useCallback, useEffect, useRef, useState } from "react";
import RequireAdmin from "../../../components/RequireAdmin";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "next-themes";
import { useLanguage } from "../../../context/LanguageContext";
import { translations } from "../../../lib/translations";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  friendlyApiMessage,
} from "../../../lib/api";
import toast from "react-hot-toast";
import { EthiopianClock, UnifiedProfileDropdown } from "../../../components/dashboard/DashboardShellShared";

const NAV_ITEMS = [
  {
    href: "/admin/dashboard",
    label: "Inbox",
    icon: FiInbox,
    exact: true,
    color: "from-purple-500 to-purple-700",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    active: "bg-gradient-to-r from-purple-500 to-purple-700",
  },
  {
    href: "/admin/dashboard/requests",
    label: "Travel Requests",
    icon: FiSend,
    color: "from-blue-500 to-blue-700",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    active: "bg-gradient-to-r from-blue-500 to-blue-700",
  },
  {
    href: "/admin/dashboard/trips",
    label: "All Trips",
    icon: FiMap,
    color: "from-emerald-500 to-emerald-700",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    active: "bg-gradient-to-r from-emerald-500 to-emerald-700",
  },
  {
    href: "/admin/dashboard/users",
    label: "Global Users",
    icon: FiUsers,
    color: "from-orange-500 to-orange-700",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    active: "bg-gradient-to-r from-orange-500 to-orange-700",
  },
  {
    href: "/admin/dashboard/agents",
    label: "Agent Management",
    icon: FiShield,
    color: "from-teal-500 to-teal-700",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    active: "bg-gradient-to-r from-teal-500 to-teal-700",
  },
  {
    href: "/admin/dashboard/bulletins",
    label: "Protocol Bulletins",
    icon: FiActivity,
    color: "from-amber-400 to-amber-600",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    active: "bg-gradient-to-r from-amber-400 to-amber-600",
  },
  {
    href: "/admin/dashboard/profile",
    label: "Settings & Profile",
    icon: FiSettings,
    color: "from-pink-500 to-pink-700",
    bg: "bg-pink-500/10",
    text: "text-pink-400",
    active: "bg-gradient-to-r from-pink-500 to-pink-700",
  },
  {
    href: "/admin/dashboard/activity",
    label: "Activity Log",
    icon: FiClock,
    color: "from-gray-500 to-gray-700",
    bg: "bg-white/5",
    text: "text-white/60",
    active: "bg-gradient-to-r from-gray-600 to-gray-800",
  },
];

function AdminNotificationPanel() {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await fetchNotifications();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
    const t = setInterval(load, 45000);
    return () => clearInterval(t);
  }, [load]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const unread = items.filter((n) => !n.read).length;

  const onReadAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const onReadOne = async (n) => {
    if (!n.read) {
      try {
        await markNotificationRead(n.id);
        setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
      } catch (e) {
        toast.error(friendlyApiMessage(e));
      }
    }

    setOpen(false);
    // Redirection Logic
    if (n.type === 'trip') {
      router.push(`/admin/dashboard/trips?id=${n.targetId}`);
    } else if (n.type === 'agent_request') {
      router.push('/admin/dashboard/agents');
    } else if (n.type === 'message') {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => { setOpen((v) => !v); if (!open) load(); }}
        className="group relative flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition-all hover:border-purple-500/50 hover:bg-white/10 hover:text-white"
        aria-label="Notifications"
      >
        <FiBell size={20} className="transition-transform group-hover:rotate-12" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white shadow-lg shadow-red-500/30">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="absolute right-0 top-full z-[200] mt-3 w-80 rounded-[1.75rem] border border-white/10 bg-[#12122a]/95 p-1 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 italic">System Alert Stream</p>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={onReadAll} className="text-xs font-semibold text-purple-400 hover:text-purple-300">
                    Mark all read
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white">
                  <FiX size={14} />
                </button>
              </div>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {loading && items.length === 0 ? (
                <p className="py-6 text-center text-sm text-white/50">Loading…</p>
              ) : items.length === 0 ? (
                <p className="py-6 text-center text-sm text-white/50">All caught up ✓</p>
              ) : (
                (() => {
                  const grouped = items.reduce((acc, n) => {
                    const key = `${n.userEmail || 'global'}-${n.type}-${n.title}`;
                    if (!acc[key]) {
                      acc[key] = { ...n, count: 1 };
                    } else {
                      acc[key].count += 1;
                      if (new Date(n.createdAt) > new Date(acc[key].createdAt)) {
                        acc[key].createdAt = n.createdAt;
                        acc[key].body = n.body;
                      }
                      if (!n.read) acc[key].read = false;
                    }
                    return acc;
                  }, {});

                  return Object.values(grouped).slice(0, 20).map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => onReadOne(n)}
                      className={`group block w-full rounded-2xl px-4 py-3 text-left transition-all hover:bg-white/5 ${
                        n.read ? "opacity-30" : "bg-purple-500/[0.03] border border-purple-500/10 mb-1"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className={`h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-white/10" : "bg-purple-500 shadow-lg shadow-purple-500/50"}`} />
                            <p className="text-xs font-bold text-white truncate">{n.title}</p>
                        </div>
                        {n.count > 1 && (
                          <span className="shrink-0 rounded-full bg-purple-500/20 px-1.5 py-0.5 text-[9px] font-black text-purple-400">
                            {n.count}x
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-2 text-[10px] text-white/50 leading-relaxed pl-5">{n.body}</p>
                      <div className="mt-1.5 flex items-center justify-between pl-5 pr-1">
                        <p className="text-[9px] font-medium text-white/20 uppercase tracking-tighter">
                          {n.createdAt ? new Date(n.createdAt).toLocaleTimeString() : ""}
                        </p>
                        {n.userEmail && <p className="text-[9px] font-black text-purple-500/40 uppercase">{n.userEmail.split('@')[0]}</p>}
                      </div>
                    </button>
                  ));
                })()
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


export default function AdminDashboardLayout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { lang } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const t = translations[lang] || translations.EN;

  // Map translations to nav labels
  const translationMap = {
    "/admin/dashboard": "dashboard",
    "/admin/dashboard/users": "globalUsers",
    "/admin/dashboard/trips": "allTrips",
    "/admin/dashboard/requests": "travelRequests",
    "/admin/dashboard/profile": "identityOps",
  };

  const translatedNavItems = NAV_ITEMS.map(item => ({
    ...item,
    label: t[translationMap[item.href]] || item.label
  }));

  const currentItem = translatedNavItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href)
  ) || translatedNavItems[0];

  return (
    <RequireAdmin>
      {/* Admin shell — full-screen, overrides the public site layout */}
      <div className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">

        {/* ── Top bar ── */}
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--bg)]/90 px-4 backdrop-blur-xl md:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
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
              <span className="hidden sm:inline text-sm font-bold tracking-tight">EthioTravel</span>
            </Link>

            {/* Breadcrumb */}
            <div className="hidden items-center gap-1 text-sm text-[var(--text-muted)] md:flex">
              <FiChevronRight size={14} />
              <span className="font-medium text-[var(--text-secondary)]">{currentItem.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Real-time Ethiopian Clock */}
            <EthiopianClock />

            <div className="flex items-center gap-3">
              {/* Notifications in top bar */}
              <AdminNotificationPanel />

              {/* Profile Dropdown */}
              <UnifiedProfileDropdown />
            </div>
          </div>
        </header>

        <div className="flex flex-1">
          {/* ── Sidebar ── */}
          {/* Desktop */}
          <aside className="hidden w-64 flex-col border-r border-[var(--border)] bg-[var(--surface)] transition-all md:flex">
            {/* User card */}
            <div className="border-b border-[var(--border)] p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-lg font-bold text-white shadow-lg">
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-[var(--text-primary)]">{user?.name || "Admin"}</p>
                  <p className="truncate text-xs text-[var(--text-muted)]">{user?.email}</p>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-500/10 px-2.5 py-1 text-xs font-bold tracking-wider text-purple-600 dark:text-purple-400">
                <FiShield size={10} /> ADMIN
              </div>
            </div>

            {/* Nav links */}
            <nav className="flex flex-1 flex-col gap-1 p-3">
              {translatedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-gradient-to-r text-white shadow-lg " + item.color
                        : "text-[var(--text-secondary)] hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs ${
                      isActive ? "bg-white/20" : "bg-[var(--panel)] text-[var(--text-muted)] group-hover:bg-[var(--border)] group-hover:text-[var(--text-primary)]"
                    }`}>
                      <Icon size={15} />
                    </span>
                    {item.label}
                    {isActive && <FiChevronRight size={14} className="ml-auto opacity-60" />}
                  </Link>
                );
              })}
            </nav>

            {/* Logout at bottom */}
            <div className="border-t border-[var(--border)] p-3">
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-500/10"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-600">
                  <FiLogOut size={15} />
                </span>
                {t.signOut}
              </button>
            </div>
          </aside>

          {/* Mobile sidebar overlay */}
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
                      <p className="font-bold text-[var(--text-primary)]">Admin Menu</p>
                      <button onClick={() => setMobileSidebarOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)]">
                        <FiX size={20} />
                      </button>
                    </div>
                    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                      {translatedNavItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.exact
                          ? pathname === item.href
                          : pathname.startsWith(item.href);
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
                              isActive
                                ? "bg-gradient-to-r text-white " + item.color
                                : "text-[var(--text-secondary)] hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
                            }`}
                          >
                            <Icon size={16} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </nav>
                    <div className="border-t border-[var(--border)] p-3">
                      <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 hover:bg-red-500/10">
                        <FiLogOut size={16} /> {t.signOut}
                      </button>
                    </div>
                  </motion.aside>
              </>
            )}
          </AnimatePresence>

          {/* ── Main content ── */}
          <main className="flex-1 overflow-x-hidden">
            {/* Page title banner */}
            <div className={`border-b border-[var(--border)] bg-[var(--surface)] px-6 py-5 md:px-8`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-lg ${currentItem.color}`}>
                  <currentItem.icon size={17} />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-[var(--text-primary)]">{currentItem.label}</h1>
                  <p className="text-xs text-[var(--text-muted)]">Admin / {currentItem.label}</p>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </RequireAdmin>
  );
}
