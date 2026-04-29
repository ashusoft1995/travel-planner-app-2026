"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiCamera, FiSave, FiUser, FiGlobe, FiInfo, FiSmartphone, FiCreditCard, FiShield, FiLock, FiAtSign, FiTrash2 } from "react-icons/fi";
import { loadUserProfile, saveUserProfile } from "../../lib/userProfileStorage";
import { useAuth } from "../../context/AuthContext";

const GENDERS = ["Female", "Male", "Non-binary", "Prefer not to say"];
const STATUSES = ["Employed", "Student", "Retired", "Self-employed", "Other"];

export default function ProfilePanel({ user, onSaved }) {
  const { updateAccount, deleteMe } = useAuth();
  const [form, setForm] = useState(() => loadUserProfile(user?.email));
  const [accForm, setAccForm] = useState({
    username: user?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.email) return;
    const p = loadUserProfile(user.email);
    setForm({
      ...p,
      fullName: p.fullName || user.name || "",
    });
    setAccForm((prev) => ({ ...prev, username: user.username || "" }));
  }, [user?.email, user?.name, user?.username]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Profile photo should be under 1.5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((p) => ({ ...p, profilePhoto: reader.result || "" }));
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!user?.email) return;

    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading("Updating records…");

    try {
      // 1. Save biographical info to local storage
      saveUserProfile(user.email, form);

      // 2. Clear credentials from API if requested
      const payload = { 
        name: form.fullName.trim() 
      };

      const isUsernameChanged = accForm.username.trim().toLowerCase() !== (user.username || "").toLowerCase();
      const isPasswordChanged = accForm.newPassword.length > 0;

      if (isUsernameChanged || isPasswordChanged) {
        if (!accForm.currentPassword) {
          toast.error("Current password is required to change credentials", { id: loadingToast });
          setSaving(false);
          return;
        }
        payload.currentPassword = accForm.currentPassword;
        if (isUsernameChanged) payload.username = accForm.username.trim();
        if (isPasswordChanged) {
          if (accForm.newPassword !== accForm.confirmPassword) {
            toast.error("New passwords do not match", { id: loadingToast });
            setSaving(false);
            return;
          }
          if (accForm.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters", { id: loadingToast });
            setSaving(false);
            return;
          }
          payload.password = accForm.newPassword;
        }
      }

      // 3. Update account via API
      await updateAccount(payload);

      toast.success("Identity Vault synchronized", { id: loadingToast });
      
      // Clear password fields on success
      setAccForm(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }));

      onSaved?.();
    } catch (err) {
      toast.error(err.message || "Failed to sync identity data", { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("CRITICAL WARNING: This will permanently purge your identity record from the EthioTravel Vault. This action is irreversible. Proceed?")) return;
    
    try {
      await deleteMe();
      toast.success("Identity record purged. Redirecting...");
    } catch (err) {
      toast.error(err.message || "Failed to purge record");
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-[#12122a] shadow-2xl"
    >
      <div className="relative border-b border-white/10 bg-gradient-to-r from-purple-500/10 via-transparent to-transparent px-8 py-8">
        <div className="relative z-10">
          <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white uppercase tracking-widest">
            <FiUser className="text-purple-400" />
            Identity <span className="text-purple-400 transition-colors">Vault</span>
          </h2>
          <p className="mt-2 text-xs font-medium text-white/40 max-w-md">
            Management credentials and secure profile data. This information is used for verified trip requests.
          </p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
      </div>

      <form onSubmit={save} className="grid gap-10 p-8 lg:grid-cols-[240px_1fr]">
        <div className="flex flex-col items-center">
          <div className="group relative h-48 w-48 overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-2xl transition hover:border-purple-500/50">
            {form.profilePhoto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.profilePhoto}
                alt="Profile"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-6xl font-black text-white/10 bg-gradient-to-br from-white/5 to-transparent">
                {(form.fullName || user?.name || "?").charAt(0).toUpperCase()}
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100 backdrop-blur-sm">
                <FiCamera className="text-white text-3xl" />
            </div>
            <label className="absolute inset-0 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </label>
          </div>
          
          <p className="mt-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Biometric Snapshot</p>
          
          <button
            type="button"
            className="mt-2 text-[10px] font-bold text-red-400/60 hover:text-red-400 transition uppercase tracking-widest"
            onClick={() => setForm((p) => ({ ...p, profilePhoto: "" }))}
          >
            Clear Data
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                    <FiUser size={12} className="text-purple-400" /> Administrative Name
                </label>
                <input
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-all font-medium"
                    value={form.fullName}
                    placeholder={user?.name || "Official legal name"}
                    onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))}
                    required
                />
            </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
               <FiGlobe size={12} className="text-blue-400" /> Origin / Nationality
            </label>
            <input
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-all font-medium"
              value={form.nationality}
              onChange={(e) => setForm((p) => ({ ...p, nationality: e.target.value }))}
              placeholder="e.g. Ethiopian"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                <FiInfo size={12} className="text-amber-400" /> Age Bracketing
            </label>
            <input
              type="number"
              min={1}
              max={120}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-amber-500/50 transition-all font-medium"
              value={form.age}
              onChange={(e) => setForm((p) => ({ ...p, age: e.target.value }))}
              placeholder="25"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                <FiUser size={12} className="text-emerald-400" /> Gender Identity
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white outline-none focus:border-emerald-500/50 transition-all font-medium appearance-none"
              value={form.gender}
              onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              required
            >
              <option value="" className="bg-[#1a1a2e]">Select…</option>
              {GENDERS.map((g) => (
                <option key={g} value={g} className="bg-[#1a1a2e]">
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                <FiShield size={12} className="text-purple-400" /> Social/Employment Node
            </label>
            <select
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white outline-none focus:border-purple-500/50 transition-all font-medium appearance-none"
              value={form.maritalOrSocialStatus}
              onChange={(e) => setForm((p) => ({ ...p, maritalOrSocialStatus: e.target.value }))}
              required
            >
              <option value="" className="bg-[#1a1a2e]">Select…</option>
              {STATUSES.map((s) => (
                <option key={s} value={s} className="bg-[#1a1a2e]">
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 grid gap-6 sm:grid-cols-2">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                  <FiSmartphone size={12} className="text-blue-400" /> Encrypted Comms (Phone)
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-blue-500/50 transition-all font-medium"
                value={form.phone}
                onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+251 …"
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                  <FiCreditCard size={12} className="text-emerald-400" /> Tracking Identifier (Passport)
              </label>
              <input
                className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-emerald-500/50 transition-all font-medium"
                value={form.passportNumber}
                onChange={(e) => setForm((p) => ({ ...p, passportNumber: e.target.value }))}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                System History & Operational Summary
            </label>
            <textarea
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-all font-medium resize-none"
              value={form.travelHistorySummary}
              onChange={(e) => setForm((p) => ({ ...p, travelHistorySummary: e.target.value }))}
              placeholder="Countries or regions visited, years, types of missions…"
              required
            />
          </div>

          <div className="sm:col-span-2 mt-8 pt-8 border-t border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest text-white mb-6 flex items-center gap-2">
              <FiShield className="text-purple-400" /> Account <span className="text-purple-400">Security</span>
            </h3>
            
            <div className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                        <FiAtSign size={12} className="text-purple-400" /> Administrative Username
                    </label>
                    <input
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-all font-medium"
                        value={accForm.username}
                        onChange={(e) => setAccForm((p) => ({ ...p, username: e.target.value }))}
                        placeholder={user?.username || "ashu"}
                    />
                </div>

                <div className="sm:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                        <FiLock size={12} className="text-red-400" /> Current Authorization Key (Password)
                    </label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-red-400/20 outline-none focus:border-red-500/50 transition-all font-medium"
                        value={accForm.currentPassword}
                        onChange={(e) => setAccForm((p) => ({ ...p, currentPassword: e.target.value }))}
                        placeholder="••••••••"
                    />
                    <p className="mt-2 text-[9px] font-bold text-white/20 uppercase">Required for username or password changes</p>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                        <FiLock size={12} className="text-emerald-400" /> New Authorization Key
                    </label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/10 outline-none focus:border-emerald-500/50 transition-all font-medium"
                        value={accForm.newPassword}
                        onChange={(e) => setAccForm((p) => ({ ...p, newPassword: e.target.value }))}
                        placeholder="Leave blank to keep current"
                    />
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-white/30 flex items-center gap-2 mb-2">
                        <FiLock size={12} className="text-emerald-400" /> Confirm New Key
                    </label>
                    <input
                        type="password"
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white placeholder:text-white/10 outline-none focus:border-emerald-500/50 transition-all font-medium"
                        value={accForm.confirmPassword}
                        onChange={(e) => setAccForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                        placeholder="••••••••"
                    />
                </div>
            </div>
          </div>

          <div className="sm:col-span-2 mt-4 flex flex-col sm:flex-row gap-4">
            <button 
                type="submit" 
                disabled={saving}
                className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-purple-500/20 active:scale-95 transition-all hover:opacity-90 disabled:opacity-50"
            >
              {saving ? (
                <>Synchronizing…</>
              ) : (
                <>
                  <FiSave size={18} /> Synchronize Profile Data
                </>
              )}
            </button>

            <button 
                type="button"
                onClick={handleDelete}
                className="flex-1 inline-flex items-center justify-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 px-8 py-4 text-sm font-black uppercase tracking-widest text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
            >
              <FiTrash2 size={18} /> Purge Identity Record
            </button>
          </div>
        </div>
      </form>
    </motion.section>
  );
}
