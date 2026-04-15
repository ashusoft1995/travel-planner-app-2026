"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2, FiUsers, FiShield, FiUser, FiSearch, FiEdit2, FiEye, FiMail, FiRefreshCw, FiX, FiSend, FiLock, FiUnlock, FiActivity } from "react-icons/fi";
import { useAuth } from "../../../../context/AuthContext";
import { tripsApi, friendlyApiMessage, postNotification } from "../../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../../context/LanguageContext";
import { translations } from "../../../../lib/translations";

const ROLE_COLORS = {
  admin: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
  agent: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
  user:  { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
};

export default function AdminUsersPage() {
  const { user } = useAuth();
  const { lang } = useLanguage();
  const t = translations[lang] || translations.EN;
  const isSuperAdmin = user?.username?.toLowerCase() === "ashu";
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'detail', 'edit', 'message'
  const [formLoading, setFormLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", username: "", role: "user", status: "active" });
  const [msgForm, setMsgForm] = useState({ title: "", body: "" });
  const [userActivity, setUserActivity] = useState({ trips: [], loading: false });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tripsApi.get("/users");
      if (Array.isArray(data)) {
        // Hierarchical Sort: Ashu > Admins > Agents > Users > Registration Date
        const sorted = data.sort((a, b) => {
          const getRank = (u) => {
            if (u.username?.toLowerCase() === "ashu") return 0;
            if (u.role === "admin") return 1;
            if (u.role === "agent") return 2;
            return 3;
          };
          const rankA = getRank(a);
          const rankB = getRank(b);
          if (rankA !== rankB) return rankA - rankB;
          // Tie-breaker: Registration Date (Newest first)
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
        setAllUsers(sorted);
      } else {
        setAllUsers([]);
      }
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const changeRole = async (userRow, newRole) => {
    try {
      const { data } = await tripsApi.patch(`/users/${userRow.id}`, { role: newRole });
      setAllUsers((prev) => prev.map((u) => (u.id === userRow.id ? data : u)));
      toast.success(`✅ Role updated to ${newRole}`);
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const toggleStatus = async (userRow) => {
    const isBlocking = userRow.status !== "blocked";
    if (userRow.username === "ashu") {
      toast.error("Security Override: Root admin status cannot be modified.");
      return;
    }
    if (!window.confirm(`${isBlocking ? "Block" : "Unblock"} user "${userRow.email}"?`)) return;
    
    try {
      const { data } = await tripsApi.patch(`/users/${userRow.id}`, { status: isBlocking ? "blocked" : "active" });
      setAllUsers((prev) => prev.map((u) => (u.id === userRow.id ? data : u)));
      toast.success(isBlocking ? "🚫 User account suspended" : "✅ User account reactivated");
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const removeUser = async (userRow) => {
    if (userRow.username === "ashu") {
      toast.error("Security Override: Root admin cannot be purged.");
      return;
    }
    if (!window.confirm(`Permanently delete user "${userRow.email}"?`)) return;
    try {
      await tripsApi.delete(`/users/${userRow.id}`);
      setAllUsers((prev) => prev.filter((u) => u.id !== userRow.id));
      toast.success("🗑 User record finalized (deleted)");
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const { data } = await tripsApi.patch(`/users/${selectedUser.id}`, editForm);
      setAllUsers(prev => prev.map(u => u.id === selectedUser.id ? data : u));
      toast.success("Account updated successfully");
      setSelectedUser(null);
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setFormLoading(false);
    }
  };

  const handleMessageSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await postNotification({
        title: msgForm.title,
        body: msgForm.body,
        audience: "user",
        userEmail: selectedUser.email
      });
      toast.success(`Message dispatched to ${selectedUser.name}`);
      setSelectedUser(null);
      setMsgForm({ title: "", body: "" });
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setFormLoading(false);
    }
  };

  const openModal = (u, mode) => {
    setSelectedUser(u);
    setModalMode(mode);
    if (mode === "edit") {
      setEditForm({
        name: u.name || "",
        email: u.email || "",
        username: u.username || "",
        role: u.role || "user",
        status: u.status || "active",
      });
    }
    fetchUserActivity(u.email);
  };

  const filtered = allUsers.filter(u => {
    const term = search.toLowerCase();
    if (!term) return true;
    if (u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term)) return true;
    if (u.id?.toLowerCase().includes(term)) return true;
    return false;
  });

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { label: t.totalUsers, value: allUsers.length, icon: FiUsers, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500/20" },
          { label: "Admins", value: allUsers.filter(u=>u.role==="admin").length, icon: FiShield, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { label: "Agents", value: allUsers.filter(u=>u.role==="agent").length, icon: FiUser, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border ${s.border} ${s.bg} p-4 shadow-sm backdrop-blur-sm`}>
            <div className="flex items-center gap-3">
              <s.icon size={18} className={s.color} />
              <div>
                <p className="text-xl font-bold text-[var(--text-primary)]">{s.value}</p>
                <p className="text-xs text-[var(--text-muted)]">{s.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search bar + Refresh */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" size={16} />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, username, or email…"
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--panel)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-orange-500/40"
          />
        </div>
        <button
          onClick={loadUsers}
          disabled={loading}
          className="flex items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--panel)] px-4 text-[var(--text-primary)] hover:bg-[var(--border)] disabled:opacity-30 transition"
          title="Refresh User List"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--panel)]">
                <th className="px-5 py-3.5 text-xs font-black uppercase tracking-[0.15em] text-[var(--text-muted)]">User Identity</th>
                <th className="px-5 py-3.5 text-xs font-black uppercase tracking-[0.15em] text-[var(--text-muted)]">Status</th>
                <th className="px-5 py-3.5 text-xs font-black uppercase tracking-[0.15em] text-[var(--text-muted)]">Commissioned</th>
                <th className="px-5 py-3.5 text-right text-xs font-black uppercase tracking-[0.15em] text-[var(--text-muted)]">Action Hub</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-white/40">No users found.</td>
                </tr>
              )}
              {filtered.map((u, i) => {
                const roleStyle = ROLE_COLORS[u.role] || ROLE_COLORS.user;
                const isSelf = u.id === user?.id;
                return (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}
                    className="hover:bg-white/[0.02] transition"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-500/20 text-sm font-black text-orange-600 dark:text-orange-400 border border-orange-500/20">
                          {(u.name || "?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-[var(--text-primary)]">{u.name}</p>
                          <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {u.status === "blocked" ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-red-500">
                          <FiLock size={10} /> Suspended
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500">
                          <FiUnlock size={10} /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-xs text-[var(--text-secondary)]">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                         <button onClick={() => openModal(u, 'detail')} className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition" title="View Details">
                           <FiEye size={16} />
                         </button>
                         <button onClick={() => openModal(u, 'edit')} className="p-2 text-white/40 hover:text-orange-400 transition" title="Edit Profile">
                           <FiEdit2 size={16} />
                         </button>
                         {!isSelf && (
                           <>
                             <button onClick={() => toggleStatus(u)} className={`p-2 transition ${u.status === 'blocked' ? 'text-emerald-400 hover:scale-110' : 'text-white/40 hover:text-red-400'}`} title={u.status === 'blocked' ? "Unblock User" : "Block User"}>
                               {u.status === 'blocked' ? <FiUnlock size={16} /> : <FiLock size={16} />}
                             </button>
                             <button onClick={() => openModal(u, 'message')} className="p-2 text-white/40 hover:text-blue-400 transition" title="Send Message">
                               <FiMail size={16} />
                             </button>
                             <button onClick={() => removeUser(u)} className="p-2 text-white/40 hover:text-red-500 transition" title="Delete User">
                               <FiTrash2 size={16} />
                             </button>
                           </>
                         )}
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Management Modal */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d0d1a]/95 p-8 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedUser(null)}
                className="absolute right-6 top-6 text-white/40 hover:text-white"
              >
                <FiX size={24} />
              </button>

              <div className="mb-8 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 text-2xl font-black text-white shadow-xl shadow-orange-500/20">
                  {selectedUser.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{selectedUser.name}</h2>
                  <p className="text-sm text-white/40 uppercase tracking-widest font-bold">Identity Node: {selectedUser.username || 'unassigned'}</p>
                </div>
              </div>

              {/* Detail View */}
              {modalMode === 'detail' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">System ID</p>
                      <p className="text-xs font-mono text-white/80 truncate">{selectedUser.id}</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Account State</p>
                      <p className={`text-xs font-bold uppercase ${selectedUser.status === 'blocked' ? 'text-red-400' : 'text-emerald-400'}`}>
                        {selectedUser.status || 'active'}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-4 border border-white/5">
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Commissioned</p>
                      <p className="text-xs font-medium text-white/80">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Activity Recap */}
                  <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5">
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4 flex items-center gap-2">
                      <FiActivity className="text-orange-500" /> Traveler Activity Stream
                    </p>
                    {userActivity.loading ? (
                       <p className="text-xs text-white/20 italic">Synchronizing activity data...</p>
                    ) : userActivity.trips.length === 0 ? (
                       <p className="text-xs text-white/20">No recorded travel history for this node.</p>
                    ) : (
                       <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs">
                             <span className="text-white/50">Total Itineraries</span>
                             <span className="font-bold text-white">{userActivity.trips.length}</span>
                          </div>
                          <div className="max-h-24 overflow-y-auto pr-2 space-y-2">
                             {userActivity.trips.slice(0, 3).map(t => (
                               <div key={t.id} className="flex items-center justify-between rounded-lg bg-white/5 p-2 text-[10px]">
                                  <span className="text-white/80 truncate max-w-[120px]">{t.destination}</span>
                                  <span className="text-white/40">{new Date(t.startDate).getFullYear()}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => setModalMode('edit')} className="rounded-2xl bg-white/5 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white/10 transition border border-white/10">
                      Modification Mode
                    </button>
                    <button onClick={() => toggleStatus(selectedUser)} className={`rounded-2xl border py-4 text-[10px] font-black uppercase tracking-[0.2em] transition ${selectedUser.status === 'blocked' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}>
                      {selectedUser.status === 'blocked' ? 'Unblock Node' : 'Suspend Node'}
                    </button>
                  </div>
                </div>
              )}

              {/* Edit View */}
              {modalMode === 'edit' && (
                <form onSubmit={handleEditSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Identity Name</label>
                    <input 
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-orange-500/50" 
                      value={editForm.name}
                      onChange={(e) => setEditForm(p => ({...p, name: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Identity Code (Username)</label>
                      <input 
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-orange-500/50" 
                        value={editForm.username}
                        onChange={(e) => setEditForm(p => ({...p, username: e.target.value}))}
                        placeholder="username"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Access Level (Role)</label>
                      <select 
                        className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-orange-500/50 appearance-none"
                        value={editForm.role}
                        onChange={(e) => setEditForm(p => ({...p, role: e.target.value}))}
                      >
                        <option value="user">Traveler</option>
                        <option value="agent">Agent</option>
                        <option value="admin">Manager (Admin)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Communication Gateway (Email)</label>
                    <input 
                      type="email"
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-orange-500/50" 
                      value={editForm.email}
                      onChange={(e) => setEditForm(p => ({...p, email: e.target.value}))}
                      required
                    />
                  </div>

                  {/* Activity Recap in Edit Mode */}
                  <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4">
                    <p className="text-[9px] font-black uppercase text-white/20 tracking-widest mb-2 flex items-center gap-2">
                       Contextual Activity Feed
                    </p>
                    {userActivity.loading ? (
                       <p className="text-[10px] text-white/10 italic">Loading...</p>
                    ) : (
                       <p className="text-[10px] text-white/40 italic">
                         {userActivity.trips.length} itineraries logged. 
                         {userActivity.trips.length > 0 && ` Last destination: ${userActivity.trips[0].destination}`}
                       </p>
                    )}
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block flex items-center justify-between">
                      <span>Account Persistence (Status)</span>
                      <span className={editForm.status === 'blocked' ? 'text-red-400' : 'text-emerald-400'}>
                        {editForm.status === 'blocked' ? 'SUSPENDED' : 'OPERATIONAL'}
                      </span>
                    </label>
                    <div className="flex gap-3">
                       {['active', 'blocked'].map(st => (
                         <button
                           key={st}
                           type="button"
                           disabled={selectedUser.username === 'ashu'}
                           onClick={() => setEditForm(p => ({...p, status: st}))}
                           className={`flex-1 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition border ${
                             selectedUser.username === 'ashu' ? 'opacity-30 cursor-not-allowed' : ''
                           } ${editForm.status === st ? (st === 'blocked' ? 'border-red-500 bg-red-500/20 text-white' : 'border-emerald-500 bg-emerald-500/20 text-white') : 'border-white/10 bg-white/5 text-white/40 hover:bg-white/10'}`}
                         >
                           {st === 'active' ? 'Active Status' : 'Block / Suspend'}
                         </button>
                       ))}
                    </div>
                    {selectedUser.username === 'ashu' && (
                      <p className="mt-2 text-[9px] text-white/30 italic">Security Lock: Root admin status is immutable.</p>
                    )}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button type="button" onClick={() => setModalMode('detail')} className="flex-1 rounded-xl bg-white/5 py-3 text-[10px] font-bold uppercase text-white/40">Cancel Changes</button>
                    <button disabled={formLoading} type="submit" className="flex-1 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/20 active:scale-95 transition">
                      {formLoading ? "Synchronizing..." : "Apply Identity Update"}
                    </button>
                  </div>
                </form>
              )}

            {/* Message View */}
              {modalMode === 'message' && (
                <form onSubmit={handleMessageSubmit} className="space-y-4">
                  <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-3 mb-2">
                     <p className="text-[10px] font-black uppercase text-blue-400 tracking-widest">Target Communication Node</p>
                     <p className="text-sm font-bold text-white">To: {selectedUser.username || selectedUser.name.split(' ')[0]}</p>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Transmission Title</label>
                    <input 
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-blue-500/50" 
                      value={msgForm.title}
                      placeholder="e.g. Account Update Required"
                      onChange={(e) => setMsgForm(p => ({...p, title: e.target.value}))}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Encrypted Payload (Message Body)</label>
                    <textarea 
                      rows={4}
                      className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none focus:border-blue-500/50 resize-none" 
                      value={msgForm.body}
                      placeholder="Enter your message to the traveler..."
                      onChange={(e) => setMsgForm(p => ({...p, body: e.target.value}))}
                      required
                    />
                  </div>
                  <div className="pt-4">
                    <button disabled={formLoading} type="submit" className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 py-4 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 active:scale-95 transition">
                      <FiSend /> {formLoading ? "Transmitting..." : "Dispatch Message"}
                    </button>
                  </div>
                </form>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
