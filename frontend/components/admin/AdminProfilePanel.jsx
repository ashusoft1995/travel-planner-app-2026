"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { 
  FiCamera, 
  FiSave, 
  FiUser, 
  FiGlobe, 
  FiInfo, 
  FiSmartphone, 
  FiCreditCard, 
  FiShield, 
  FiLock, 
  FiAtSign,
  FiUsers,
  FiUserPlus,
  FiUserMinus,
  FiKey,
  FiRefreshCw,
  FiTrash2,
  FiAward,
  FiSettings,
  FiActivity,
  FiX,
  FiCheckCircle,
  FiAlertCircle
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { tripsApi, friendlyApiMessage } from "../../lib/api";

const SUPER_ADMIN = "ashu";

export default function AdminProfilePanel({ user, onSaved }) {
  const { updateAccount, token } = useAuth();
  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    bio: user?.about || "",
    location: "",
    expertise: user?.expertise || []
  });
  
  const [accForm, setAccForm] = useState({
    username: user?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [allUsers, setAllUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const isSuperAdmin = user?.username === SUPER_ADMIN;

  const fetchUsers = useCallback(async () => {
    if (!isSuperAdmin) return;
    setLoadingUsers(true);
    try {
      const { data } = await tripsApi.get("/users");
      setAllUsers(data?.data || []);
    } catch (error) {
      toast.error(friendlyApiMessage(error));
    } finally {
      setLoadingUsers(false);
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (isSuperAdmin) fetchUsers();
  }, [isSuperAdmin, fetchUsers]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const loadingToast = toast.loading("Synchronizing identity data...");

    try {
      const payload = { 
        name: form.fullName.trim(),
        phone: form.phone,
        about: form.bio,
        expertise: form.expertise
      };

      const isUsernameChanged = accForm.username.trim().toLowerCase() !== (user.username || "").toLowerCase();
      const isPasswordChanged = accForm.newPassword.length > 0;

      if (isUsernameChanged || isPasswordChanged) {
        if (!accForm.currentPassword) {
          toast.error("Current password required for credential override", { id: loadingToast });
          setSaving(false);
          return;
        }
        payload.currentPassword = accForm.currentPassword;
        if (isUsernameChanged) payload.username = accForm.username.trim();
        if (isPasswordChanged) {
          if (accForm.newPassword !== accForm.confirmPassword) {
            toast.error("Passwords mismatch", { id: loadingToast });
            setSaving(false);
            return;
          }
          payload.password = accForm.newPassword;
        }
      }

      await updateAccount(payload);
      toast.success("Identity Vault synchronized", { id: loadingToast });
      setAccForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      if (onSaved) onSaved();
    } catch (error) {
      toast.error(friendlyApiMessage(error), { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const updateUserStatus = async (targetId, status) => {
    const loadingToast = toast.loading(`Modifying user ${targetId}...`);
    try {
      await tripsApi.put(`/users/${targetId}`, { status });
      toast.success(`User status updated to ${status}`, { id: loadingToast });
      fetchUsers();
    } catch (error) {
      toast.error(friendlyApiMessage(error), { id: loadingToast });
    }
  };

  const deleteUser = async (targetId) => {
    if (!confirm("Permanently purge this record from the registry?")) return;
    const loadingToast = toast.loading("Purging record...");
    try {
      await tripsApi.delete(`/users/${targetId}`);
      toast.success("Record purged successfully", { id: loadingToast });
      fetchUsers();
    } catch (error) {
      toast.error(friendlyApiMessage(error), { id: loadingToast });
    }
  };

  const agentRequests = allUsers.filter(u => u.role === 'agent' && u.status === 'pending');

  const tabs = [
    { id: "profile", label: "Identity", icon: FiUser },
    { id: "security", label: "Security", icon: FiShield },
  ];

  if (isSuperAdmin) {
    tabs.push(
      { id: "users", label: "Registry", icon: FiUsers },
      { id: "agents", label: "Agent Queue", icon: FiUserPlus }
    );
  }

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-xl shadow-purple-600/20 border border-white/20">
            {user?.name?.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tight">{user?.name}</h2>
            <p className="text-[10px] text-purple-400 font-black uppercase tracking-[0.2em] flex items-center gap-2 mt-1">
              {isSuperAdmin ? <FiAward className="text-amber-400" /> : <FiShield />}
              {isSuperAdmin ? "Super Admin" : "System Administrator"} • Protocol Mode
            </p>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
              activeTab === tab.id 
              ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30" 
              : "text-white/40 hover:text-white hover:bg-white/5"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
            {tab.id === 'agents' && agentRequests.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse ml-1" />
            )}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" && (
          <motion.div
            key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            <div className="space-y-6 rounded-3xl border border-white/10 bg-[#12122a] p-8 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-2">
                <FiInfo className="text-purple-400" /> Biographical Records
              </h3>
              <form onSubmit={save} className="space-y-6">
                 <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Identity Full Name</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none" 
                        value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Telecom Node (Phone)</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none" 
                        value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Biographical Brief</label>
                      <textarea 
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none resize-none" 
                        value={form.bio} onChange={e => setForm({...form, bio: e.target.value})} 
                      />
                    </div>
                 </div>
                 <button disabled={saving} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition shadow-xl shadow-purple-600/20 active:scale-95">
                    {saving ? "Synchronizing..." : "Apply Identity Changes"}
                 </button>
              </form>
            </div>

            <div className="space-y-6 rounded-3xl border border-white/10 bg-[#12122a] p-8 shadow-2xl flex flex-col justify-center items-center text-center">
               <div className="h-32 w-32 rounded-[2rem] bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center text-4xl font-black text-white/20 mb-6">
                 {user?.name?.charAt(0)}
               </div>
               <h4 className="text-lg font-black text-white uppercase tracking-tight">Satellite Uplink</h4>
               <p className="text-xs text-white/30 mt-2 max-w-[200px] leading-relaxed">Identity photo synchronization is managed via Global Gravatar Protocol.</p>
               <div className="mt-8 p-4 rounded-2xl bg-white/5 border border-white/5 w-full text-left">
                  <p className="text-[9px] font-black text-purple-400 uppercase tracking-widest mb-2">Network Metadata</p>
                  <p className="text-[10px] text-white/50 font-medium">Access Code: <span className="text-white">PROT-{user?.id}</span></p>
                  <p className="text-[10px] text-white/50 font-medium">Last Sync: <span className="text-white">{new Date().toLocaleString()}</span></p>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto"
          >
            <div className="rounded-3xl border border-white/10 bg-[#12122a] p-8 shadow-2xl">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8 flex items-center gap-2">
                <FiLock className="text-purple-400" /> Credential Management
              </h3>
              <form onSubmit={save} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Username (@)</label>
                      <input 
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none" 
                        value={accForm.username} onChange={e => setAccForm({...accForm, username: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">New Password</label>
                      <input 
                        type="password"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none" 
                        value={accForm.newPassword} onChange={e => setAccForm({...accForm, newPassword: e.target.value})} 
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Confirm Password</label>
                      <input 
                        type="password"
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none" 
                        value={accForm.confirmPassword} onChange={e => setAccForm({...accForm, confirmPassword: e.target.value})} 
                      />
                    </div>
                    <div className="md:col-span-2 pt-4 border-t border-white/5">
                      <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Current Authorization Key</label>
                      <input 
                        type="password"
                        placeholder="Required for any credential overrides"
                        className="w-full bg-purple-500/5 border border-purple-500/20 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none placeholder:text-purple-400/20" 
                        value={accForm.currentPassword} onChange={e => setAccForm({...accForm, currentPassword: e.target.value})} 
                      />
                    </div>
                 </div>
                 <button disabled={saving} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition shadow-xl shadow-purple-600/20 active:scale-95">
                    Update Security Protocols
                 </button>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && isSuperAdmin && (
          <motion.div
            key="users" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 flex items-center gap-2">
                  <FiUsers className="text-purple-400" /> Global Node Registry
                </h3>
                <button onClick={fetchUsers} className="text-[10px] font-black uppercase text-purple-400 hover:text-white transition flex items-center gap-2">
                  <FiRefreshCw className={loadingUsers ? "animate-spin" : ""} /> Sync
                </button>
             </div>

             <div className="rounded-3xl border border-white/10 bg-[#12122a] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-white/30 border-b border-white/5">
                      <tr>
                        <th className="px-6 py-4">Entity</th>
                        <th className="px-6 py-4">Protocol</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Overrides</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {allUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-white/[0.02] transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                               <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center font-black text-white/40">
                                 {u.name?.charAt(0)}
                               </div>
                               <div>
                                  <p className="font-bold text-white uppercase tracking-tight">{u.name}</p>
                                  <p className="text-[10px] text-white/20 uppercase font-black">@{u.username}</p>
                               </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                              u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                              u.role === 'agent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                              'bg-white/5 text-white/30 border-white/10'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                               <div className={`h-1.5 w-1.5 rounded-full ${u.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                               <span className={`text-[10px] font-black uppercase tracking-widest ${u.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                                 {u.status}
                               </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                {u.status === 'active' ? (
                                  <button onClick={() => updateUserStatus(u.id, 'blocked')} className="p-2 rounded-lg bg-white/5 text-white/30 hover:bg-red-500/20 hover:text-red-400 transition" title="Suspend Access">
                                    <FiUserMinus size={14} />
                                  </button>
                                ) : (
                                  <button onClick={() => updateUserStatus(u.id, 'active')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition" title="Restore Access">
                                    <FiUserPlus size={14} />
                                  </button>
                                )}
                                {u.id !== user.id && (
                                  <button onClick={() => deleteUser(u.id)} className="p-2 rounded-lg bg-white/5 text-white/30 hover:bg-red-600 hover:text-white transition" title="Purge Record">
                                    <FiTrash2 size={14} />
                                  </button>
                                )}
                             </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === "agents" && isSuperAdmin && (
          <motion.div
            key="agents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
             <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-4 flex items-center gap-2">
                <FiUserPlus className="text-purple-400" /> Pending Expert Authorization
             </h3>
             
             {agentRequests.length === 0 ? (
                <div className="py-20 text-center rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02]">
                   <FiCheckCircle size={32} className="mx-auto text-emerald-400/20 mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/20">All expert requests processed</p>
                </div>
             ) : (
                <div className="grid gap-6">
                   {agentRequests.map((req) => (
                     <div key={req.id} className="rounded-3xl border border-white/10 bg-[#12122a] p-6 shadow-2xl flex flex-col md:flex-row gap-6 items-start">
                        <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl font-black text-white/20 shrink-0">
                          {req.name?.charAt(0)}
                        </div>
                        <div className="flex-1 space-y-4">
                           <div>
                              <h4 className="text-lg font-black text-white uppercase tracking-tight">{req.name}</h4>
                              <p className="text-[10px] text-purple-400 font-bold uppercase tracking-widest">@{req.username} • {req.email}</p>
                           </div>
                           <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                              <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Application Data</p>
                              <p className="text-xs text-white/60 leading-relaxed italic">"{req.about || "No biographical data provided."}"</p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                 {(req.expertise || []).map((exp, i) => (
                                   <span key={i} className="px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 text-[9px] font-bold uppercase tracking-widest border border-blue-500/20">{exp}</span>
                                 ))}
                              </div>
                           </div>
                           <div className="flex items-center gap-4">
                              <button onClick={() => updateUserStatus(req.id, 'active')} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition shadow-lg shadow-emerald-600/20">Authorize</button>
                              <button onClick={() => updateUserStatus(req.id, 'rejected')} className="px-6 py-2.5 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition border border-white/10">Deny Access</button>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
