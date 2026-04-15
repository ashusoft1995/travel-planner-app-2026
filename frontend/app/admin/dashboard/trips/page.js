"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiTrash2, FiMap, FiClock, FiUser, FiDollarSign, FiSearch, FiEdit2, FiEye, FiActivity, FiRefreshCw } from "react-icons/fi";
import { tripsApi, patchTripApproval, friendlyApiMessage, getApiUrl, authHeaders } from "../../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../../context/LanguageContext";
import { translations } from "../../../../lib/translations";

export default function AdminTripsPage() {
  const { lang } = useLanguage();
  const t = translations[lang] || translations.EN;
  const [allTrips, setAllTrips] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [modalMode, setModalMode] = useState('detail'); // 'detail' | 'edit'
  const [editForm, setEditForm] = useState(null);

  const loadAllTrips = useCallback(async () => {
    setLoading(true);
    try {
      const [tripsRes, usersRes] = await Promise.all([
        tripsApi.get("/trips"),
        fetch(getApiUrl("/users"), { headers: authHeaders() }).then(r => r.json())
      ]);
      setAllTrips(Array.isArray(tripsRes.data) ? tripsRes.data : []);
      setAgents((usersRes.users || []).filter(u => u.role === 'agent' && u.status === 'active'));
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllTrips();
  }, [loadAllTrips]);

  const approveTripRow = async (trip) => {
    try {
      const { data } = await patchTripApproval(trip.id, { decision: "approved", note: "" });
      setAllTrips((prev) => prev.map((t) => (t.id === trip.id ? data : t)));
      toast.success("✅ Trip approved!");
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const rejectTripRow = async (trip) => {
    const note = window.prompt("Reason for rejection (optional):") || "";
    try {
      const { data } = await patchTripApproval(trip.id, { decision: "rejected", note });
      setAllTrips((prev) => prev.map((t) => (t.id === trip.id ? data : t)));
      toast.success("Trip rejected");
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const removeTrip = async (trip) => {
    if (!window.confirm(`Delete trip "${trip.destination}"?`)) return;
    try {
      await tripsApi.delete(`/trips/${trip.id}`);
      setAllTrips((prev) => prev.filter((t) => t.id !== trip.id));
      toast.success("🗑 Trip deleted");
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const openDetail = (trip) => {
    setSelected(trip);
    setModalMode('detail');
  };

  const openEdit = (trip) => {
    setSelected(trip);
    setEditForm({ ...trip });
    setModalMode('edit');
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await tripsApi.put(`/trips/${selected.id}`, editForm);
      setAllTrips(prev => prev.map(t => t.id === data.id ? data : t));
      toast.success("Trip updated successfully");
      setSelected(null);
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const filtered = allTrips.filter(t => {
    const st = t.approvalStatus || "approved";
    const matchesFilter = filter === "all" || st === filter;
    const matchesSearch = 
      t.destination?.toLowerCase().includes(search.toLowerCase()) ||
      t.ownerEmail?.toLowerCase().includes(search.toLowerCase()) ||
      t.id?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = allTrips.filter(t => (t.approvalStatus || "approved") === "pending").length;

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search & Statistics */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Asset Value", value: `$${allTrips.reduce((s,t)=>s+Number(t.budget||0),0).toLocaleString()}`, icon: FiDollarSign, color: "text-emerald-500", bg: "bg-emerald-500/10" },
          { label: "Pending Review", value: pendingCount, icon: FiClock, color: "text-amber-500", bg: "bg-amber-500/10" },
          { label: t.activeTrips, value: allTrips.length, icon: FiMap, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: t.activeNode, value: [...new Set(allTrips.map(t => t.destination))].length, icon: FiActivity, color: "text-purple-500", bg: "bg-purple-500/10" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border border-[var(--border)] ${s.bg} p-4 flex items-center gap-4 shadow-sm`}>
            <div className={`p-3 rounded-xl bg-[var(--surface)] ${s.color} border border-[var(--border)]`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xl font-black text-[var(--text-primary)]">{s.value}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
         {/* Search */}
        <div className="relative max-w-md w-full">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination, email, or ID..."
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-indigo-500/40"
          />
          <button
            onClick={loadAllTrips}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-indigo-500 disabled:opacity-30 transition-colors"
            title="Refresh Ledger"
          >
            <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2">
          {["all","pending","approved","rejected"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                filter === f
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/20 scale-105"
                  : "border border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              {f} {f === "all" ? `(${allTrips.length})` : f === "pending" ? `(${pendingCount})` : ""}
            </button>
          ))}
        </div>
      </div>

      {/* Trips table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--panel)]">
                <th className="px-5 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Destination & ID</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Asset Owner</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Status</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Timeline</th>
                <th className="px-5 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Budget</th>
                <th className="px-5 py-4 text-right text-xs font-black uppercase tracking-widest text-[var(--text-muted)]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-white/40 italic">
                    No matching itineraries in database.
                  </td>
                </tr>
              )}
              {filtered.map((t, i) => {
                const ap = t.approvalStatus || "approved";
                return (
                  <motion.tr
                    key={t.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/[0.03] transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-500/20">
                          <FiMap size={18} />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--text-primary)] tracking-tight">{t.destination}</p>
                          <p className="text-[9px] text-[var(--text-muted)] font-mono tracking-tighter">ID: {t.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                         <div className="h-6 w-6 rounded-md bg-[var(--panel)] flex items-center justify-center text-[10px] font-bold text-[var(--text-muted)] ring-1 ring-[var(--border)] group-hover:bg-indigo-500/10 group-hover:text-indigo-600 transition-colors">
                           {t.ownerEmail?.charAt(0).toUpperCase()}
                         </div>
                         <span className="text-[var(--text-secondary)] font-medium">{t.ownerEmail || "—"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest group-hover:scale-105 transition-transform ${
                        ap === "pending"
                          ? "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/30"
                          : ap === "rejected"
                          ? "bg-red-500/10 text-red-600 ring-1 ring-red-500/30"
                          : "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/30"
                      }`}>
                        {ap}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                       <span className="text-[11px] font-bold text-[var(--text-muted)]">{t.startDate}</span>
                       <span className="mx-2 text-[var(--text-muted)] opacity-30">→</span>
                       <span className="text-[11px] font-bold text-[var(--text-muted)]">{t.endDate}</span>
                    </td>
                    <td className="px-5 py-4 font-black text-[var(--text-primary)]">${Number(t.budget || 0).toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap justify-end gap-2">
                        {ap === "pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() => approveTripRow(t)}
                              title="Quick Approve"
                              className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white transition shadow-lg shadow-emerald-500/10"
                            >
                              <FiCheck size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => rejectTripRow(t)}
                              title="Quick Reject"
                              className="p-2 rounded-xl bg-orange-500/10 text-orange-400 hover:bg-orange-500 hover:text-white transition shadow-lg shadow-orange-500/10"
                            >
                              <FiX size={16} />
                            </button>
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => openDetail(t)}
                          title="View Itinerary Specs"
                          className="p-2 rounded-xl bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white transition shadow-lg shadow-purple-500/10"
                        >
                          <FiEye size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(t)}
                          title="Modify Data Points"
                          className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition shadow-lg shadow-blue-500/10"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeTrip(t)}
                          title="System Erase"
                          className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition shadow-lg shadow-red-500/10"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[2.5rem] border border-white/10 bg-[#0d0d1a] p-8 shadow-2xl relative custom-scrollbar"
            >
              <button onClick={() => setSelected(null)} className="absolute right-8 top-8 text-white/30 hover:text-white transition-colors"><FiX size={24} /></button>
              
              {modalMode === 'detail' && (
                <div className="space-y-8">
                  <header className="flex items-start gap-5">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl shadow-purple-500/20">
                      <FiMap size={32} />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tight">{selected.destination}</h2>
                      <div className="mt-1 flex flex-wrap items-center gap-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Core Protocol: {selected.id}</span>
                         <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                           selected.approvalStatus === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                         }`}>
                           {selected.approvalStatus || 'approved'}
                         </span>
                      </div>
                    </div>
                  </header>

                  <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                     <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Budget Index</p>
                        <p className="text-xl font-black text-white">${Number(selected.budget).toLocaleString()}</p>
                     </div>
                     <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Accommodation</p>
                        <p className="text-sm font-bold text-white truncate">{selected.accommodation || 'Unspecified'}</p>
                     </div>
                     <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 text-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Time Range</p>
                        <p className="text-xs font-bold text-white">{selected.startDate} — {selected.endDate}</p>
                     </div>
                  </section>

                  <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col items-center justify-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Assigned Agent</p>
                        <p className="text-sm font-bold text-white">
                           {selected.assignedAgent 
                             ? (agents.find(a => a.id === selected.assignedAgent)?.name || selected.assignedAgent)
                             : <span className="text-white/30 italic">None Assigned</span>}
                        </p>
                     </div>
                     <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 flex flex-col items-center justify-center">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/20 mb-1">Agent Status</p>
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                          selected.agentStatus === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                          selected.agentStatus === 'declined' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {selected.agentStatus || 'pending'}
                        </span>
                     </div>
                  </section>Section

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-400 mb-4 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-purple-500 shadow-[0_0_8px_purple]" />
                        Itinerary Manifest
                      </h3>
                      <div className="space-y-3 pl-3 border-l border-white/5">
                        {Array.isArray(selected.itinerary) && selected.itinerary.length > 0 ? (
                           selected.itinerary.map((item, idx) => (
                             <div key={idx} className="relative py-1">
                                <span className="text-[10px] font-black text-white/20 absolute -left-7 top-1">{String(idx+1).padStart(2,'0')}</span>
                                <p className="text-sm text-white/70 leading-relaxed">{item}</p>
                             </div>
                           ))
                        ) : (
                          <p className="text-sm text-white/20 italic">No itinerary items mapped.</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400 mb-4 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_emerald]" />
                        Activity Logs
                      </h3>
                      <div className="flex flex-wrap gap-2">
                         {Array.isArray(selected.activities) && selected.activities.length > 0 ? (
                            selected.activities.map((a, i) => (
                              <span key={i} className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
                                {a}
                              </span>
                            ))
                         ) : (
                           <p className="text-sm text-white/20 italic">Empty activity buffer.</p>
                         )}
                      </div>
                    </div>

                    {selected.notes && (
                       <div>
                         <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-2">Administrative Notes</h3>
                         <p className="rounded-2xl bg-white/[0.03] p-4 text-sm text-white/50 leading-relaxed italic border border-white/5">
                           "{selected.notes}"
                         </p>
                       </div>
                    )}
                  </div>

                  <footer className="pt-6 flex gap-4">
                    <button onClick={() => openEdit(selected)} className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-blue-500/20 active:scale-95 transition">
                      Enter Update Sequence
                    </button>
                    <button onClick={() => setSelected(null)} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition">
                      Close Spec
                    </button>
                  </footer>
                </div>
              )}

              {modalMode === 'edit' && (
                <form onSubmit={handleUpdate} className="space-y-6">
                  <header>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-4">
                      <FiEdit2 size={24} />
                    </div>
                    <h2 className="text-2xl font-black text-white">Modify Itinerary</h2>
                    <p className="text-xs text-white/40 tracking-tight">Updating asset data for global node: {selected.id}</p>
                  </header>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Destination</label>
                      <input className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50" value={editForm.destination} onChange={e => setEditForm({...editForm, destination: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Budget Allocation ($)</label>
                      <input type="number" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50" value={editForm.budget} onChange={e => setEditForm({...editForm, budget: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Start Date</label>
                      <input type="date" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50" value={editForm.startDate} onChange={e => setEditForm({...editForm, startDate: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">End Date</label>
                      <input type="date" className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50" value={editForm.endDate} onChange={e => setEditForm({...editForm, endDate: e.target.value})} />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Accommodation Node</label>
                      <input className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50" value={editForm.accommodation} onChange={e => setEditForm({...editForm, accommodation: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Protocol Status</label>
                      <select 
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50 appearance-none uppercase text-xs font-black tracking-widest"
                        value={editForm.approvalStatus || 'approved'}
                        onChange={e => setEditForm({...editForm, approvalStatus: e.target.value})}
                      >
                         <option value="pending">🟡 Pending</option>
                         <option value="approved">🟢 Approved</option>
                         <option value="rejected">🔴 Rejected</option>
                         <option value="blocked">🚫 Blocked</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Assigned Agent</label>
                      <select 
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50 appearance-none text-xs font-bold text-white"
                        value={editForm.assignedAgent || ''}
                        onChange={e => setEditForm({...editForm, assignedAgent: e.target.value || null})}
                      >
                         <option value="">-- No Agent --</option>
                         {agents.map(a => (
                            <option key={a.id} value={a.id}>{a.name} (@{a.username})</option>
                         ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Agent Status</label>
                      <select 
                        className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50 appearance-none uppercase text-xs font-black tracking-widest"
                        value={editForm.agentStatus || 'pending'}
                        onChange={e => setEditForm({...editForm, agentStatus: e.target.value})}
                      >
                         <option value="pending">🟡 Pending</option>
                         <option value="accepted">🟢 Accepted</option>
                         <option value="declined">🔴 Declined</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 block mb-2">Administrative Notes</label>
                    <textarea rows={3} className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-white outline-none focus:border-blue-500/50 resize-none" value={editForm.notes} onChange={e => setEditForm({...editForm, notes: e.target.value})} />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button type="submit" className="flex-1 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-500/20 active:scale-95 transition">Commit Changes</button>
                    <button type="button" onClick={() => setModalMode('detail')} className="flex-1 rounded-2xl border border-white/10 bg-white/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition">Back to Spec</button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-[10px] text-white/20 italic text-center py-8">
        EthioAdmin v2.1 — Distributed Trip Ledger Management
      </div>
    </div>
  );
}
