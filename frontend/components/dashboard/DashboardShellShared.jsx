"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSun, 
  FiMoon, 
  FiGlobe, 
  FiLogOut, 
  FiChevronDown,
  FiSettings
} from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../lib/translations";

export function EthiopianClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const gHour = time.getHours();
  const etHour = (gHour + 18) % 12 || 12;
  const etMin = String(time.getMinutes()).padStart(2, "0");
  const etCycle = gHour >= 6 && gHour < 18 ? "Day" : "Night";

  const etDay = (time.getDate() + 22) % 30 || 30;
  const etYear = 2018; 

  return (
    <div className="hidden flex-col items-end px-3 py-1 border-r border-[var(--border)] lg:flex">
      <div className="flex items-center gap-1.5 text-xs font-black text-[var(--text-secondary)]">
        <span className="text-orange-500">{etHour}:{etMin}</span>
        <span className="text-[9px] uppercase tracking-tighter text-[var(--text-muted)]">{etCycle}</span>
      </div>
      <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--text-muted)] truncate">
        Miazia {etDay}, {etYear} EC
      </p>
    </div>
  );
}

export function UnifiedProfileDropdown() {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const t = translations[lang] || translations.EN;

  useEffect(() => {
    if (!open) return;
    const clickAway = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", clickAway);
    return () => document.removeEventListener("mousedown", clickAway);
  }, [open]);

  const isDark = theme === "dark";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-1 pr-3 transition hover:border-white/20 hover:bg-white/10"
      >
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-xs font-black text-white shadow-lg shadow-purple-500/20">
            {user?.name?.charAt(0).toUpperCase() || (user?.username?.charAt(0).toUpperCase()) || "U"}
          </div>
          <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0d0d1a] bg-emerald-500" />
        </div>
        <FiChevronDown className={`text-white/40 transition-transform ${open ? "rotate-180" : ""}`} size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-3 w-64 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl backdrop-blur-2xl z-[300]"
          >
            <div className="p-4 border-b border-[var(--border)]">
              <p className="text-xs font-bold text-[var(--text-primary)]">{user?.name || user?.username}</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{user?.email}</p>
            </div>

            <div className="py-2 space-y-1">
              <Link
                href={user?.role === "admin" ? "/admin/dashboard/profile" : "/dashboard/profile"}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
              >
                <FiSettings size={14} />
                <span>{t.settings || "Settings"}</span>
              </Link>

              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex w-full items-center justify-between rounded-xl px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-3">
                  {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
                  <span>{t.appearance}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--text-muted)]">
                  {isDark ? t.darkMode : t.lightMode}
                </span>
              </button>

              <div className="px-4 py-2">
                <div className="flex items-center gap-3 mb-2 text-xs font-medium text-[var(--text-secondary)]">
                  <FiGlobe size={14} />
                  <span>{t.language}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {["EN", "AM", "OR"].map((l) => (
                    <button
                      key={l}
                      onClick={() => setLang(l)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                        lang === l 
                          ? "bg-purple-500 text-white shadow-lg" 
                          : "bg-[var(--panel)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-[var(--border)] my-2" />

              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10"
              >
                <FiLogOut size={14} />
                <span>{t.signOut}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
