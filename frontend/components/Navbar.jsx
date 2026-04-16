"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { FiLogOut, FiMenu, FiUser, FiX, FiShield, FiLayout } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Trips" },
  { href: "/add-trip", label: "Add trip" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    setHydrated(true);
  }, []);

  const links = isAdmin
    ? [
        { href: "/", label: "Home" },
        { href: "/trips", label: "Trips" },
        { href: "/admin/dashboard", label: "Admin Console" },
        { href: "/about", label: "About" },
      ]
    : baseLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-brand-950/90 backdrop-blur-xl dark:bg-brand-950/95">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-green text-sm font-bold text-white shadow-lg">
            ET
          </span>
          <span className="hidden sm:inline">EthioTravel</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  isActive
                    ? "text-accent-yellow"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                {l.label}
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute -bottom-1 left-1/2 h-1 w-4 -translate-x-1/2 rounded-full bg-accent-yellow shadow-[0_0_8px_rgba(255,215,0,0.6)]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {hydrated && isAdmin && (
            <Link
              href="/admin/dashboard"
              className="hidden items-center gap-1 rounded-full bg-brand-500/20 border border-brand-500/30 px-3 py-2 text-xs font-bold text-brand-400 transition hover:bg-brand-500/30 md:inline-flex"
            >
              <FiShield className="text-brand-400" /> Back to Admin
            </Link>
          )}
          {hydrated && user ? (
            user.username === "ashu" ? (
              // Root admin (Ashu) doesn't see Logout here, only the Dashboard link added above
              null
            ) : (
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="hidden items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 md:inline-flex"
              >
                <FiLogOut /> Log out
              </button>
            )
          ) : (
            hydrated && (
              <Link
                href="/login"
                className="hidden rounded-full bg-accent-yellow px-4 py-2 text-xs font-bold text-brand-950 transition hover:opacity-90 md:inline-block"
              >
                Login
              </Link>
            )
          )}
          <NotificationBell />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white md:hidden"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-brand-950 px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    isActive
                      ? "bg-accent-yellow/10 text-accent-yellow"
                      : "text-slate-100 hover:bg-white/10"
                  }`}
                >
                  {l.label}
                  {isActive && <div className="h-1.5 w-1.5 rounded-full bg-accent-yellow" />}
                </Link>
              );
            })}
            {hydrated && user ? (
              user.username === "ashu" ? (
                <Link
                  href="/admin/dashboard"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-brand-400 hover:bg-white/10"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                  }}
                  className="mt-2 rounded-xl px-3 py-3 text-left text-sm font-semibold text-accent-yellow hover:bg-white/10"
                >
                  Log out
                </button>
              )
            ) : (
              hydrated && (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-xl px-3 py-3 text-sm font-semibold text-accent-yellow hover:bg-white/10"
                >
                  Login
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </header>
  );
}
