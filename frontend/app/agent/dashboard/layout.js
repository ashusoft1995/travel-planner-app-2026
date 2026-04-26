"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiInbox,
  FiMap,
  FiSettings,
  FiClock,
  FiLogOut,
  FiMenu,
  FiX
} from "react-icons/fi";
import { useState } from "react";
import RequireAuth from "../../../components/RequireAuth";
import { useAuth } from "../../../context/AuthContext";
import { UnifiedProfileDropdown } from "../../../components/dashboard/DashboardShellShared";

const NAV_ITEMS = [
  {
    href: "/agent/dashboard",
    label: "Mission Inbox",
    icon: FiInbox,
    exact: true,
  },
  {
    href: "/agent/dashboard/history",
    label: "Trip History",
    icon: FiMap,
  },
  {
    href: "/agent/dashboard/profile",
    label: "Settings & Profile",
    icon: FiSettings,
  },
];

function AgentSidebar({ mobileOpen, setMobileOpen }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-[#0a0a16] shadow-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between px-6">
          <Link href="/agent/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
              <span className="font-black">ET</span>
            </div>
            <div>
              <p className="font-black uppercase tracking-widest text-white text-sm">Agent Portal</p>
              <p className="text-[10px] text-teal-400 font-bold tracking-widest">EthioTravel</p>
            </div>
          </Link>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setMobileOpen(false)}>
            <FiX size={24} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-4 rounded-xl px-4 py-3.5 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-teal-500/10 text-teal-400 shadow-sm ring-1 ring-teal-500/20"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={18} className={isActive ? "text-teal-400" : "opacity-70"} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/5 p-4">
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 py-3 text-xs font-black uppercase tracking-widest text-red-500 transition hover:bg-red-500 hover:text-white"
          >
            <FiLogOut size={16} /> Secure Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default function AgentDashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  return (
    <RequireAuth>
      <div className="flex h-screen bg-[#06060c] text-slate-300 font-sans">
        <AgentSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex flex-1 flex-col overflow-hidden relative">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/10 bg-[#0a0a16]/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setMobileOpen(true)}>
                <FiMenu size={24} />
              </button>
              <h1 className="text-xl font-black text-white hidden sm:block">Agent Dashboard</h1>
            </div>

            <div className="flex items-center gap-4">
               <UnifiedProfileDropdown />
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-10">
            <div className="mx-auto max-w-6xl">{children}</div>
          </div>
        </main>
      </div>
    </RequireAuth>
  );
}
