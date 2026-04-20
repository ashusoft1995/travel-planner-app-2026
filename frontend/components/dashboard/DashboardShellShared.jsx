"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSun, 
  FiMoon, 
  FiGlobe, 
  FiLogOut, 
  FiChevronDown,
  FiSettings,
  FiUser,
  FiCamera,
  FiSave,
  FiX
} from "react-icons/fi";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { translations } from "../../lib/translations";
import { uploadFile } from "../../lib/supabase";
import toast from "react-hot-toast";

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
  const { user, logout, updateAccount } = useAuth();
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", username: "", phone: "", avatar: "" });
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef(null);

  const t = translations[lang] || translations.EN;

  useEffect(() => {
    if (user) {
      setEditForm({
        name: user.name || "",
        username: user.username || "",
        phone: user.phone || "",
        avatar: user.avatar || ""
      });
    }
  }, [user]);

  useEffect(() => {
    if (!open) {
      setIsEditing(false);
      return;
    }
    const clickAway = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", clickAway);
    return () => document.removeEventListener("mousedown", clickAway);
  }, [open]);

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const tid = toast.loading("Uploading avatar...");
    try {
      const url = await uploadFile(file);
      setEditForm(prev => ({ ...prev, avatar: url }));
      toast.success("Avatar updated", { id: tid });
    } catch (err) {
      toast.error(err.message, { id: tid });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAccount(editForm);
      toast.success("Successfully Updated");
      setIsEditing(false);
      setOpen(false); // Close the dropdown as well
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const isDark = theme === "dark";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 p-1 pr-3 transition hover:border-white/20 hover:bg-white/10"
      >
        <div className="relative">
          {user?.avatar ? (
             <img src={user.avatar} className="h-8 w-8 rounded-xl object-cover border border-white/10" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-xs font-black text-white shadow-lg shadow-purple-500/20">
              {user?.name?.charAt(0).toUpperCase() || (user?.username?.charAt(0).toUpperCase()) || "U"}
            </div>
          )}
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
            className="absolute right-0 top-full mt-3 w-72 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-2 shadow-2xl backdrop-blur-2xl z-[300]"
          >
            {isEditing ? (
              <div className="p-4 space-y-4">
                 <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Edit Identity</p>
                    <button onClick={() => setIsEditing(false)} className="text-[var(--text-muted)] hover:text-white"><FiX /></button>
                 </div>
                 
                 <div className="flex justify-center mb-4">
                    <label className="relative cursor-pointer group">
                       {editForm.avatar ? (
                         <img src={editForm.avatar} className="h-16 w-16 rounded-2xl object-cover border border-white/10" />
                       ) : (
                         <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10"><FiUser size={24} className="text-white/20" /></div>
                       )}
                       <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                          <FiCamera className="text-white" />
                       </div>
                       <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
                    </label>
                 </div>

                 <div className="space-y-3">
                    <input 
                      type="text" 
                      placeholder="Display Name"
                      value={editForm.name}
                      onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-purple-500 transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder="Username"
                      value={editForm.username}
                      onChange={e => setEditForm({...editForm, username: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-purple-500 transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder="Phone"
                      value={editForm.phone}
                      onChange={e => setEditForm({...editForm, phone: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 rounded-xl px-3 py-2.5 text-xs text-white outline-none focus:border-purple-500 transition-all"
                    />
                 </div>

                 <button 
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-[10px] py-3 rounded-xl shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2"
                 >
                   {saving ? "Syncing..." : <><FiSave /> Save Changes</>}
                 </button>
              </div>
            ) : (
              <>
                <div className="p-4 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    {user?.avatar ? (
                       <img src={user.avatar} className="h-10 w-10 rounded-xl object-cover border border-white/10" />
                    ) : (
                       <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-xs font-black text-white shadow-lg">
                         {user?.name?.charAt(0).toUpperCase() || "U"}
                       </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name || user?.username}</p>
                      <p className="text-[10px] text-[var(--text-muted)] truncate italic">@{user?.username}</p>
                    </div>
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
                  >
                    <FiSettings size={14} className="text-purple-400" />
                    <span>Identity Settings</span>
                  </button>

                  <button
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-2 text-xs font-medium text-[var(--text-secondary)] hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
                  >
                    <div className="flex items-center gap-3">
                      {isDark ? <FiSun size={14} className="text-amber-400" /> : <FiMoon size={14} className="text-blue-400" />}
                      <span>{t.appearance}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-tighter text-[var(--text-muted)]">
                      {isDark ? t.darkMode : t.lightMode}
                    </span>
                  </button>

                  <div className="px-4 py-2">
                    <div className="flex items-center gap-3 mb-2 text-xs font-medium text-[var(--text-secondary)]">
                      <FiGlobe size={14} className="text-emerald-400" />
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
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
