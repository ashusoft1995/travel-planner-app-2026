"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  FiTrash2, 
  FiUsers, 
  FiShield, 
  FiUser, 
  FiSearch, 
  FiEdit2, 
  FiEye, 
  FiMail, 
  FiRefreshCw, 
  FiX, 
  FiSend, 
  FiLock, 
  FiUnlock, 
  FiActivity,
  FiUserCheck,
  FiCircle,
  FiUserPlus
} from "react-icons/fi";
import { useAuth } from "../../../../context/AuthContext";
import { tripsApi, friendlyApiMessage } from "../../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalMode, setModalMode] = useState(null); // 'detail', 'edit'
  const [formLoading, setFormLoading] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", username: "", role: "user", status: "active" });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tripsApi.get("/users");
      const users = data?.data || [];
      
      // Hierarchical Sort Logic
      const sorted = users.sort((a, b) => {
        const getRank = (u) => {
          if (u.id === "1200" || u.username === "ashu") return 0;
          if (u.role === "admin") return 1;
          if (u.role === "agent") return 2;
          return 3;
        };

        const rankA = getRank(a);
        const rankB = getRank(b);

        if (rankA !== rankB) return rankA - rankB;
        
        // Secondary Sort: Numeric ID (lowest first for admins, registration date for others)
        if (rankA === 1) return parseInt(a.id) - parseInt(b.id);
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      });

      setAllUsers(sorted);
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const toggleStatus = async (userRow) => {
    if (userRow.id === "1200" || userRow.username === "ashu") {
      toast.error("Security Lock: Super Admin status is immutable.");
      return;
    }
    const isBlocking = userRow.status !== "blocked";
    if (!confirm(`Are you sure you want to ${isBlocking ? 'BLOCK' : 'UNBLOCK'} ${userRow.name}?`)) return;

    try {
      await tripsApi.put(`/users/${userRow.id}`, { status: isBlocking ? "blocked" : "active" });
      toast.success(isBlocking ? "User account suspended" : "User account reactivated");
      loadUsers();
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const removeUser = async (userRow) => {
    if (userRow.id === "1200" || userRow.username === "ashu") {
      toast.error("Security Lock: Super Admin cannot be deleted.");
      return;
    }
    if (!confirm(`Permanently delete user "${userRow.name}"? This cannot be undone.`)) return;
    try {
      await tripsApi.delete(`/users/${userRow.id}`);
      toast.success("User record deleted.");
      loadUsers();
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await tripsApi.put(`/users/${selectedUser.id}`, editForm);
      toast.success("Account updated successfully");
      setSelectedUser(null);
      loadUsers();
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setFormLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await tripsApi.post("/users", editForm);
      toast.success("New account registered successfully");
      setSelectedUser(null);
      setModalMode(null);
      loadUsers();
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setFormLoading(false);
    }
  };

  const openModal = (u, mode) => {
    setSelectedUser(u);
    setModalMode(mode);
    if (mode === "edit" || mode === "create") {
      setEditForm({
        name: u?.name || "",
        email: u?.email || "",
        username: u?.username || "",
        password: "",
        role: u?.role || "admin",
        status: u?.status || "active",
      });
    }
  };

  const filtered = allUsers.filter(u => {
    const term = search.toLowerCase();
    if (!term) return true;
    return (
      u.name?.toLowerCase().includes(term) || 
      u.username?.toLowerCase().includes(term) || 
      u.id?.toString().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  const stats = {
    total: allUsers.length,
    admins: allUsers.filter(u => u.role === "admin").length,
    agents: allUsers.filter(u => u.role === "agent").length,
    travelers: allUsers.filter(u => u.role === "user").length
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg" />
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-white/40">Fetching Global Registry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", val: stats.total, icon: FiUsers, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Admins", val: stats.admins, icon: FiShield, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "Agents", val: stats.agents, icon: FiUserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Travelers", val: stats.travelers, icon: FiUser, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((s, i) => (
          <div key={i} className={`rounded-2xl border border-white/5 bg-[#12122a] p-5 shadow-2xl transition hover:border-white/10`}>
             <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{s.label}</p>
                  <p className="mt-1 text-2xl font-black text-white">{s.val}</p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg} ${s.color} ring-1 ring-white/10`}>
                  <s.icon size={20} />
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* ── Search & Controls ── */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text"
            placeholder="Search by Name, ID, or Username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#12122a] border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-sm text-white placeholder:text-white/20 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all shadow-xl"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={() => openModal(null, 'create')} className="flex items-center gap-2 px-6 py-3.5 bg-purple-600 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-purple-500 transition shadow-lg shadow-purple-600/20">
            <FiUserPlus /> Admin Register
          </button>
          <button onClick={loadUsers} className="flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest text-white hover:bg-white/10 transition">
            <FiRefreshCw /> Sync Registry
          </button>
        </div>
      </div>

      {/* ── User Table ── */}
      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#12122a] shadow-3xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30 bg-white/[0.02]">
                <th className="px-6 py-5">Entity Node (ID)</th>
                <th className="px-6 py-5">Access Level</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Commissioned</th>
                <th className="px-6 py-5 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filtered.map((u) => {
                const isSuper = u.id === "1200" || u.username === "ashu";
                return (
                  <tr key={u.id} className={`group hover:bg-white/[0.02] transition ${isSuper ? 'bg-purple-500/[0.03]' : ''}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black border border-white/10 shadow-lg ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : u.role === 'agent' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/40'}`}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-white flex items-center gap-1.5">
                            {u.name} 
                            {isSuper && <FiShield size={12} className="text-purple-400" title="Super Admin" />}
                          </p>
                          <p className="text-[10px] text-white/30 uppercase font-black tracking-tighter">ID: {u.id} • @{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : u.role === 'agent' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                         <FiCircle size={8} className={`fill-current ${u.status === 'blocked' ? 'text-red-500' : 'text-emerald-500 animate-pulse'}`} />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${u.status === 'blocked' ? 'text-red-400' : 'text-emerald-400'}`}>
                            {u.status || 'active'}
                         </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white/30 font-medium">
                       {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'Historical'}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => openModal(u, 'detail')} className="p-2.5 rounded-xl bg-white/10 text-white/60 hover:bg-blue-500/20 hover:text-blue-400 transition" title="View Details">
                            <FiEye size={16} />
                          </button>
                          {u.role !== 'user' && (
                            <button onClick={() => openModal(u, 'edit')} className="p-2.5 rounded-xl bg-white/10 text-white/60 hover:bg-purple-500/20 hover:text-purple-400 transition" title="Edit Profile">
                              <FiEdit2 size={16} />
                            </button>
                          )}
                          <button 
                            disabled={isSuper}
                            onClick={() => toggleStatus(u)} 
                            className={`p-2.5 rounded-xl transition ${isSuper ? 'opacity-20 cursor-not-allowed' : u.status === 'blocked' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                            title={u.status === 'blocked' ? 'Unblock Node' : 'Block Node'}
                          >
                            {u.status === 'blocked' ? <FiUnlock size={16} /> : <FiLock size={16} />}
                          </button>
                          <button 
                             disabled={isSuper}
                             onClick={() => removeUser(u)}
                             className={`p-2.5 rounded-xl bg-white/10 text-white/60 transition ${isSuper ? 'opacity-20' : 'hover:bg-red-500/20 hover:text-red-500'}`}
                             title="Purge Record"
                          >
                            <FiTrash2 size={16} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-20 text-center italic text-white/20 text-sm">No entity nodes match your transmission parameters</div>
          )}
        </div>
      </div>

      {/* ── USER DETAIL / EDIT MODAL ── */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#12122a] shadow-3xl"
            >
              <div className={`h-24 bg-gradient-to-r ${selectedUser.role === 'admin' ? 'from-purple-600 to-blue-600' : 'from-emerald-600 to-blue-600'} opacity-20`} />
              
              <div className="px-8 pb-8">
                <div className="relative -mt-12 mb-6 flex justify-between items-end">
                  <div className="h-24 w-24 rounded-3xl bg-[#12122a] p-1 shadow-2xl">
                    <div className="h-full w-full rounded-2xl bg-white/5 flex items-center justify-center text-3xl font-black text-white border border-white/10">
                      {selectedUser?.name ? selectedUser.name.charAt(0) : <FiUserPlus />}
                    </div>
                  </div>
                  <button onClick={() => { setSelectedUser(null); setModalMode(null); }} className="mb-2 p-2 rounded-full bg-white/5 text-white/40 hover:text-white"><FiX size={20} /></button>
                </div>

                {modalMode === 'detail' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-2xl font-black text-white">{selectedUser.name}</h3>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Node ID: {selectedUser.id} • Registered Node</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Email Protocol</p>
                        <p className="text-xs text-white font-medium truncate">{selectedUser.email}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                        <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Telecom Link</p>
                        <p className="text-xs text-white font-medium">{selectedUser.phone || 'None'}</p>
                      </div>
                    </div>

                    <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-4 flex items-center gap-2">
                         <FiActivity className="text-blue-400" /> Registration Intelligence
                       </h4>
                       <div className="space-y-4">
                          {selectedUser.about && (
                            <div>
                              <p className="text-[8px] font-black uppercase text-white/20 mb-1">Bio / Profile</p>
                              <p className="text-xs text-white/70 italic leading-relaxed">"{selectedUser.about}"</p>
                            </div>
                          )}
                          {selectedUser.expertise && selectedUser.expertise.length > 0 && (
                            <div>
                              <p className="text-[8px] font-black uppercase text-white/20 mb-2">Technical Expertise</p>
                              <div className="flex flex-wrap gap-1.5">
                                {selectedUser.expertise.map((exp, i) => (
                                  <span key={i} className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20">{exp}</span>
                                ))}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center justify-between pt-2 border-t border-white/5">
                            <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Access Protocol</span>
                            <span className="text-[10px] text-white font-black uppercase tracking-widest bg-white/5 px-2 py-1 rounded-lg">{selectedUser.role}</span>
                          </div>
                       </div>
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setModalMode('edit')} className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition shadow-xl shadow-purple-600/20">Enter Modification Mode</button>
                      <button onClick={() => setSelectedUser(null)} className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition border border-white/10">Dismiss</button>
                    </div>
                  </div>
                )}

                {modalMode === 'edit' && selectedUser && (
                  <form onSubmit={handleEditSubmit} className="space-y-5">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Identity Name</label>
                        <input 
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50" 
                          value={editForm.name}
                          onChange={e => setEditForm({...editForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Username (@)</label>
                          <input 
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50" 
                            value={editForm.username}
                            onChange={e => setEditForm({...editForm, username: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Security Role</label>
                          <select 
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 appearance-none"
                            value={editForm.role}
                            onChange={e => setEditForm({...editForm, role: e.target.value})}
                          >
                            <option value="user" className="bg-[#12122a] text-white">Traveler</option>
                            <option value="agent" className="bg-[#12122a] text-white">Agent</option>
                            <option value="admin" className="bg-[#12122a] text-white">Admin / Manager</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Communication Email</label>
                        <input 
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50" 
                          value={editForm.email}
                          onChange={e => setEditForm({...editForm, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                      <button type="button" onClick={() => setModalMode('detail')} className="flex-1 py-4 bg-white/5 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">Cancel</button>
                      <button disabled={formLoading} type="submit" className="flex-1 py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition shadow-xl shadow-purple-600/20">
                        {formLoading ? 'Synchronizing...' : 'Apply Overrides'}
                      </button>
                    </div>
                  </form>
                )}

                {modalMode === 'create' && (
                  <form onSubmit={handleCreateSubmit} className="space-y-5">
                    <h3 className="text-2xl font-black text-white mb-4">Register Admin</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Identity Name</label>
                        <input 
                          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50" 
                          value={editForm.name}
                          onChange={e => setEditForm({...editForm, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Username (@)</label>
                          <input 
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50" 
                            value={editForm.username}
                            onChange={e => setEditForm({...editForm, username: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Security Role</label>
                          <select 
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50 appearance-none"
                            value={editForm.role}
                            onChange={e => setEditForm({...editForm, role: e.target.value})}
                          >
                            <option value="admin" className="bg-[#12122a] text-white">Admin / Manager</option>
                            <option value="agent" className="bg-[#12122a] text-white">Agent</option>
                            <option value="user" className="bg-[#12122a] text-white">Traveler</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Communication Email</label>
                          <input 
                            type="email"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50" 
                            value={editForm.email}
                            onChange={e => setEditForm({...editForm, email: e.target.value})}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Temporary Password</label>
                          <input 
                            type="password"
                            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none focus:border-purple-500/50" 
                            value={editForm.password}
                            onChange={e => setEditForm({...editForm, password: e.target.value})}
                            required
                            minLength={6}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 flex gap-3">
                      <button type="button" onClick={() => { setSelectedUser(null); setModalMode(null); }} className="flex-1 py-4 bg-white/5 text-white/40 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10">Cancel</button>
                      <button disabled={formLoading} type="submit" className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition shadow-xl shadow-emerald-600/20">
                        {formLoading ? 'Registering...' : 'Register New Node'}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
