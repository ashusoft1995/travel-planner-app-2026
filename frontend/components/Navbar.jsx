"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { FiLogOut, FiMenu, FiUser, FiX, FiShield, FiLayout } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import LanguageSelector from "./common/LanguageSelector";
import Image from "next/image";

const baseLinks = [
  { href: "/", label: "Home" },
  { href: "/trips", label: "Destinations" },
  { href: "/experiences", label: "Experiences" },
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
        { href: "/trips", label: "Destinations" },
        { href: "/admin/dashboard", label: "Admin Console" },
        { href: "/about", label: "About" },
      ]
    : baseLinks;

  return (
    <header className="sticky top-0 z-50 border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl">
      <div className="container flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 text-xl font-black text-[#051128] dark:text-white uppercase tracking-tighter group">
          <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20 transition-transform group-hover:scale-110">
            <Image 
              src="/logo.png" 
              alt="EthioTravel Logo" 
              fill 
              className="object-cover"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-blue-600 text-lg">Ethio</span>
            <span className="text-xs tracking-[0.3em] text-slate-400 group-hover:text-blue-400 transition-colors">Travel</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((l) => {
            const isActive = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-400 hover:text-[#051128] dark:hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {hydrated && user ? (
            <div className="flex items-center gap-4">
               {isAdmin && (
                  <Link
                    href="/admin/dashboard"
                    className="hidden items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-blue-600 transition hover:bg-blue-100 md:inline-flex"
                  >
                    <FiShield /> Admin
                  </Link>
               )}
               <button
                 type="button"
                 onClick={() => {
                   logout();
                   setOpen(false);
                 }}
                 className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#051128] transition hover:bg-slate-50 md:inline-flex"
               >
                 <FiLogOut /> Log out
               </button>
            </div>
          ) : (
            hydrated && (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="hidden text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition md:inline-block"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hidden rounded-xl bg-blue-600 px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20 transition hover:bg-blue-500 md:inline-block"
                >
                  Get Started
                </Link>
              </div>
            )
          )}
          <NotificationBell />
          <LanguageSelector variant="compact" />
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 dark:border-slate-700 bg-white/5 text-slate-900 dark:text-white md:hidden"
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
            
            {/* Language Selector for Mobile */}
            <div className="mt-4 pt-4 border-t border-white/10">
              <LanguageSelector />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
