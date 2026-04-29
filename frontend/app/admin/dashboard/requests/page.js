"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { FiCalendar, FiEdit2, FiMail, FiTrash2, FiUser, FiSend, FiX, FiMapPin, FiActivity, FiClock, FiCheck, FiSearch } from "react-icons/fi";
import {
  fetchAdminTravelRequests,
  putAdminTravelRequest,
  deleteAdminTravelRequest,
  patchAdminTravelRequest,
  friendlyApiMessage,
} from "../../../../lib/api";
import { useLanguage } from "../../../../context/LanguageContext";
import { translations } from "../../../../lib/translations";

const STATUS_OPTIONS = ["pending", "reviewing", "approved", "rejected"];

const STATUS_STYLES = {
  pending:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20", ring: "ring-amber-500/30" },
  reviewing: { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",  ring: "ring-blue-500/30"  },
  approved:  { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", ring: "ring-emerald-500/30" },
  rejected:  { bg: "bg-red-500/10",     text: "text-red-400",     border: "border-red-500/20",   ring: "ring-red-500/30"   },
};

function emptyTravelForm() {
  return { status:"pending", fullName:"", email:"", phone:"", nationality:"", age:"", gender:"", desiredDestination:"", preferredStartDate:"", preferredEndDate:"", budgetHint:"", accommodationPreference:"", specialRequests:"", travelHistory:"", adminNotes:"" };
}

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyTravelForm());
  const [saving, setSaving] = useState(false);
  const { lang } = useLanguage();
  const t = translations[lang] || translations.EN;

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchAdminTravelRequests();
      const mapped = (Array.isArray(data) ? data : []).map(r => ({
        ...r,
        fullName: r.full_name || r.fullName,
        desiredDestination: r.desired_destination || r.desiredDestination,
        preferredStartDate: r.preferred_start_date || r.preferredStartDate,
        preferredEndDate: r.preferred_end_date || r.preferredEndDate,
        budgetHint: r.budget_hint || r.budgetHint,
        accommodationPreference: r.accommodation_preference || r.accommodationPreference,
        specialRequests: r.special_requests || r.specialRequests,
        travelHistory: r.travel_history || r.travelHistory,
        adminNotes: r.admin_notes || r.adminNotes
      }));
      setRequests(mapped);
    } catch (e) { toast.error(friendlyApiMessage(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const openEdit = (row) => {
    setSelected(row);
    setForm({
      status: row.status || "pending", fullName: row.fullName || "", email: row.email || "",
      phone: row.phone || "", nationality: row.nationality || "", age: String(row.age ?? ""),
      gender: row.gender || "", desiredDestination: row.desiredDestination || "",
      preferredStartDate: row.preferredStartDate || "", preferredEndDate: row.preferredEndDate || "",
      budgetHint: row.budgetHint || "", accommodationPreference: row.accommodationPreference || "",
      specialRequests: row.specialRequests || "", travelHistory: row.travelHistory || "", adminNotes: row.adminNotes || ""
    });
  };

  const closeEdit = () => { setSelected(null); setForm(emptyTravelForm()); };

  const saveRequest = async (e) => {
    e.preventDefault();
    if (!selected?.id) return;
    const age = Number(form.age);
    if (!Number.isFinite(age) || age < 1 || age > 120) { toast.error("Age must be 1–120"); return; }
    setSaving(true);
    try {
      // Map back to snake_case for backend if needed, but backend already handles camelCase
      const payload = {
        ...form,
        age,
        // Ensure backend picking logic works by providing both if needed or just camelCase
        fullName: form.fullName,
        desiredDestination: form.desiredDestination,
        preferredStartDate: form.preferredStartDate,
        preferredEndDate: form.preferredEndDate,
        budgetHint: form.budgetHint,
        accommodationPreference: form.accommodationPreference,
        specialRequests: form.specialRequests,
        travelHistory: form.travelHistory,
        adminNotes: form.adminNotes
      };
      const { data } = await putAdminTravelRequest(selected.id, payload);
      
      // Map the returned data again
      const updated = {
        ...data,
        fullName: data.full_name || data.fullName,
        desiredDestination: data.desired_destination || data.desiredDestination,
        preferredStartDate: data.preferred_start_date || data.preferredStartDate,
        preferredEndDate: data.preferred_end_date || data.preferredEndDate,
        budgetHint: data.budget_hint || data.budgetHint,
        accommodationPreference: data.accommodation_preference || data.accommodationPreference,
        specialRequests: data.special_requests || data.specialRequests,
        travelHistory: data.travel_history || data.travelHistory,
        adminNotes: data.admin_notes || data.adminNotes
      };
      
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success("✅ Protocol updated");
      closeEdit();
    } catch (err) { toast.error(friendlyApiMessage(err)); }
    finally { setSaving(false); }
  };

  const quickStatus = async (row, status) => {
    try {
      const { data } = await patchAdminTravelRequest(row.id, { status });
      const updated = {
        ...data,
        fullName: data.full_name || data.fullName,
        desiredDestination: data.desired_destination || data.desiredDestination,
        preferredStartDate: data.preferred_start_date || data.preferredStartDate,
        preferredEndDate: data.preferred_end_date || data.preferredEndDate,
        budgetHint: data.budget_hint || data.budgetHint,
        accommodationPreference: data.accommodation_preference || data.accommodationPreference,
        specialRequests: data.special_requests || data.specialRequests,
        travelHistory: data.travel_history || data.travelHistory,
        adminNotes: data.admin_notes || data.adminNotes
      };
      setRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      toast.success(`Operational Status: ${status}`);
    } catch (e) { toast.error(friendlyApiMessage(e)); }
  };

  const removeRequest = async (row) => {
    if (!window.confirm(`Erase request node for ${row.fullName || "user"}?`)) return;
    try {
      await deleteAdminTravelRequest(row.id);
      setRequests((prev) => prev.filter((r) => r.id !== row.id));
      toast.success("🗑 Request records purged");
      if (selected?.id === row.id) closeEdit();
    } catch (e) { toast.error(friendlyApiMessage(e)); }
  };

  const filtered = requests.filter(r => {
    const term = search.toLowerCase();
    return !term || 
      r.fullName?.toLowerCase().includes(term) ||
      r.desiredDestination?.toLowerCase().includes(term) ||
      r.id?.toLowerCase().includes(term) ||
      r.email?.toLowerCase().includes(term);
  });

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto h-16 w-16">
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-500/20" />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-bold tracking-widest text-white/40 uppercase">Loading Data Grid</p>
        </div>
      </div>
    );
  }

  const f = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="space-y-8 pb-12">
      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATUS_OPTIONS.map((s, i) => {
          // Normalize status comparison to avoid "Approved" vs "approved" missed counts
          const count = requests.filter(r => 
            String(r.status || "pending").toLowerCase().trim() === s.toLowerCase()
          ).length;
          
          const st = STATUS_STYLES[s];
          const icons = { pending: FiClock, reviewing: FiActivity, approved: FiCheck, rejected: FiX };
          const Icon = icons[s];
          
          // Localization for status labels
          const statusLabels = {
            pending: t.pending,
            approved: t.approved,
            rejected: t.rejected,
            reviewing: t.reviewing
          };

          return (
            <motion.div 
               key={s} 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: i * 0.1 }}
               className={`relative overflow-hidden rounded-2xl border ${st.border} ${st.bg} p-5 group transition-all hover:bg-white/[0.05] shadow-sm`}
            >
               <div className="flex items-center justify-between">
                 <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${st.text}`}>{statusLabels[s] || s} {t.queue}</p>
                    <p className="mt-1 text-2xl font-black text-[var(--text-primary)]">{count}</p>
                 </div>
                 <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 ${st.text} ring-1 ${st.ring}`}>
                   <Icon size={18} />
                 </div>
               </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative max-w-md w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search manifests by name, place, or ID..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-blue-500/40 transition-all shadow-sm"
          />
        </div>
      </div>

      <section className="grid gap-6">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] py-20 text-center shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-xl ring-1 ring-blue-500/30">
              <FiSend size={32} />
            </div>
            <p className="mt-6 text-sm font-black uppercase tracking-widest text-[var(--text-primary)]">No Operational Requests Detected</p>
            <p className="mt-2 text-xs text-[var(--text-muted)]">The data grid is currently synchronized and empty.</p>
          </div>
        )}

        {filtered.map((r, i) => {
          const st = STATUS_STYLES[r.status?.toLowerCase()] || STATUS_STYLES.pending;
          return (
            <motion.article
              key={r.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="group relative overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-xl transition hover:border-blue-500/30"
            >
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-widest ${st.bg} ${st.text} ring-1 ${st.ring}`}>
                      {r.status || "pending"}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-1">
                      <FiClock size={10} /> {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="flex items-center gap-3 text-xl font-black text-[var(--text-primary)] tracking-tight">
                      <FiMapPin size={20} className="text-blue-600 dark:text-blue-400 group-hover:scale-125 transition-transform" />
                      {r.desiredDestination || "Unspecified Node"}
                      <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-tighter">REQ-{r.id.slice(0,8)}</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-2 gap-x-6">
                    <div className="flex items-center gap-2 text-xs">
                        <div className="h-6 w-6 rounded-lg bg-[var(--panel)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border)]"><FiUser size={12} /></div>
                        <span className="font-bold text-[var(--text-secondary)]">{r.fullName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="h-6 w-6 rounded-lg bg-[var(--panel)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border)]"><FiMail size={12} /></div>
                        <span className="font-bold text-[var(--text-muted)] truncate">{r.email || r.accountEmail || "—"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <div className="h-6 w-6 rounded-lg bg-[var(--panel)] flex items-center justify-center text-[var(--text-muted)] border border-[var(--border)]"><FiCalendar size={12} /></div>
                        <span className="font-bold text-[var(--text-muted)]">{r.preferredStartDate || "—"} → {r.preferredEndDate || "—"}</span>
                    </div>
                  </div>

                  {r.adminNotes && (
                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 text-[11px] font-medium text-blue-700 dark:text-blue-300 leading-relaxed shadow-inner">
                      📋 <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest mr-2">{t.adminNote}:</span> {r.adminNotes}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-[var(--border)] mt-4 pt-4">
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => quickStatus(r, s)}
                        disabled={r.status === s}
                        className={`rounded-xl border px-3 py-1.5 text-[9px] font-black uppercase tracking-[0.1em] transition-all hover:scale-105 active:scale-95 ${
                          r.status === s ? "opacity-30 cursor-default " + STATUS_STYLES[s].text + " " + STATUS_STYLES[s].border : STATUS_STYLES[s].text + " " + STATUS_STYLES[s].border + " hover:bg-[var(--panel)]"
                        }`}
                      >
                        {r.status === s ? "Selected" : s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-3 md:flex-col">
                  <button
                    type="button"
                    onClick={() => openEdit(r)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 transition hover:opacity-90 active:scale-95"
                  >
                    <FiEdit2 size={14} /> Analyze & Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => removeRequest(r)}
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-400 transition hover:bg-red-600 hover:text-white active:scale-95"
                  >
                    <FiTrash2 size={14} /> Purge Node
                  </button>
                </div>
              </div>
            </motion.article>
          );
        })}
      </section>

      {/* Edit modal — Executive Overlay */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/10 bg-[#0d0d1a] p-10 shadow-2xl relative"
            >
              <button onClick={closeEdit} className="absolute right-8 top-8 text-white/30 hover:text-white transition"><FiX size={24} /></button>
              
              <div className="mb-10">
                 <div className="flex h-14 w-14 items-center justify-center rounded-[2rem] bg-blue-500/10 text-blue-400 mb-6 shadow-xl ring-1 ring-blue-500/30">
                   <FiEdit2 size={24} />
                 </div>
                 <h2 className="text-3xl font-black text-white">Modify Travel Manifest</h2>
                 <p className="text-sm text-white/40 tracking-tight">Security oversight and operational adjustment for node {selected.id}</p>
              </div>

              <form onSubmit={saveRequest} className="space-y-8">
                {/* Status Selection */}
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 shadow-inner">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-4">Set Operational Priority (Status)</label>
                  <div className="flex flex-wrap gap-3">
                    {STATUS_OPTIONS.map((s) => {
                      const st = STATUS_STYLES[s];
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, status: s }))}
                          className={`rounded-2xl border px-6 py-3 text-[11px] font-black uppercase tracking-widest transition-all ${
                            form.status === s
                              ? `${st.bg} ${st.border} ${st.text} ring-2 ring-purple-500/50 scale-105`
                              : "border-white/10 text-white/40 hover:border-white/20"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1">Identity: Full Name</label>
                      <input className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50" value={form.fullName} onChange={f("fullName")} required />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1">Comms: Official Email</label>
                      <input type="email" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50" value={form.email} onChange={f("email")} required />
                   </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-3">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1">Citizen: Nationality</label>
                      <input className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50" value={form.nationality} onChange={f("nationality")} required />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1">Demographics: Age</label>
                      <input type="number" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50" value={form.age} onChange={f("age")} required />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1">Temporal: Destination Node</label>
                      <input className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50" value={form.desiredDestination} onChange={f("desiredDestination")} required />
                   </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1">Ops window: Start Date</label>
                      <input type="date" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50 shadow-inner" value={form.preferredStartDate} onChange={f("preferredStartDate")} />
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1">Ops window: End Date</label>
                      <input type="date" className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50" value={form.preferredEndDate} onChange={f("preferredEndDate")} />
                   </div>
                </div>

                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1">Global History Manifest</label>
                   <textarea rows={4} className="w-full rounded-3xl border border-white/10 bg-white/5 py-4 px-5 text-sm font-bold text-white outline-none focus:border-blue-500/50 resize-none" value={form.travelHistory} onChange={f("travelHistory")} required placeholder="Complete historical summary required..." />
                </div>

                <div>
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2 px-1 uppercase tracking-widest text-blue-400">Supervisor Oversight (Internal Admin Notes)</label>
                   <textarea rows={3} className="w-full rounded-3xl border border-blue-500/20 bg-blue-500/[0.03] py-4 px-5 text-sm font-bold text-blue-300 outline-none focus:border-blue-500/50 shadow-inner" value={form.adminNotes} onChange={f("adminNotes")} placeholder="Official supervisory annotations..." />
                </div>

                <div className="flex gap-6 pt-6">
                  <button type="submit" disabled={saving} className="flex-1 rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 py-5 text-xs font-black uppercase tracking-[0.2em] text-white shadow-2xl shadow-blue-500/30 active:scale-95 transition-all">
                    {saving ? "Synchronizing..." : "Commit Protocol Updates"}
                  </button>
                  <button type="button" onClick={closeEdit} className="rounded-[2rem] border border-white/10 bg-white/5 px-10 py-5 text-xs font-black uppercase tracking-[0.2em] text-white/30 hover:text-white hover:bg-white/10 transition-all">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
