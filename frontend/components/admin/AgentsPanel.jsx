"use client";

import { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { 
  FiCheck, 
  FiX, 
  FiShield, 
  FiUser, 
  FiEye, 
  FiEdit, 
  FiTrash2, 
  FiSlash, 
  FiSend,
  FiCircle,
  FiUserCheck,
  FiClock,
  FiSearch,
  FiLock,
  FiUnlock,
  FiRefreshCcw
} from "react-icons/fi";
import { tripsApi, friendlyApiMessage } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function AgentsPanel() {
  const router = useRouter();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [search, setSearch] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await tripsApi.get("/users");
      const allUsers = res.data?.data || [];
      setAgents(allUsers.filter(u => u.role === "agent"));
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await tripsApi.put(`/users/${id}`, { status });
      toast.success(`Agent Status: ${status.toUpperCase()}`);
      fetchUsers();
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    }
  };

  const [pendingDelete, setPendingDelete] = useState(null);

  const deleteAgent = async (id) => {
    setPendingDelete(id);
    const toastId = toast((t) => (
      <div className="flex items-center gap-3">
        <span className="text-xs font-bold">Purging record in 3s...</span>
        <button 
          onClick={() => {
            setPendingDelete(null);
            toast.dismiss(t.id);
          }}
          className="bg-white/10 px-3 py-1 rounded-lg text-[10px] font-black uppercase hover:bg-white/20 transition"
        >
          Undo
        </button>
      </div>
    ), { duration: 3000, style: { background: '#1e1b4b', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' } });

    setTimeout(async () => {
      setPendingDelete(currentId => {
        if (currentId === id) {
          executeDelete(id);
          return null;
        }
        return currentId;
      });
    }, 3000);
  };

  const executeDelete = async (id) => {
    try {
      await tripsApi.delete(`/users/${id}`);
      toast.success("Identity purged from registry.");
      fetchUsers();
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    }
  };

  const sendMessageToAgent = (agent) => {
    // Redirect to main dashboard with recipient ID and CMessage view
    router.push(`/admin/dashboard?view=cmessages&recipient=${agent.id}`);
  };

  const filteredAgents = useMemo(() => {
    const term = search.toLowerCase();
    if (!term) return agents;
    return agents.filter(a => 
      a.name?.toLowerCase().includes(term) || 
      a.username?.toLowerCase().includes(term) || 
      a.id?.toString().includes(term) ||
      a.email?.toLowerCase().includes(term)
    );
  }, [agents, search]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg" />
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-white/40">Syncing Intelligence...</p>
      </div>
    );
  }

  const requested = filteredAgents.filter(a => a.status === "pending" || a.status === "rejected");
  const management = filteredAgents.filter(a => a.status === "active" || a.status === "blocked");

  return (
    <div className="space-y-12">
      {/* ── SEARCH BAR ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          <input 
            type="text"
            placeholder="Filter by Name, ID, or @username..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 text-xs text-white placeholder:text-white/20 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all shadow-xl"
          />
        </div>
        <button 
          onClick={() => { setLoading(true); fetchUsers(); }}
          className="p-3.5 rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-purple-400 hover:bg-white/10 transition group"
          title="Refresh Data"
        >
          <FiRefreshCcw size={18} className="group-active:rotate-180 transition-transform duration-500" />
        </button>
      </div>

      {/* ── SECTION 1: AGENT REQUESTED ── */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50">
              <FiClock size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Agent Requests</h2>
              <p className="text-[10px] text-white/40">New applications and rejected entries</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {requested.map((agent) => (
            <motion.div 
              layout
              key={agent.id} 
              className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition hover:border-white/10"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center text-lg font-bold text-white border border-white/10">
                  {agent.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white">{agent.name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${agent.status === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                      {agent.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-white/30">ID: {agent.id} • {agent.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedAgent(agent)}
                  className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white transition"
                  title="View Profile"
                >
                  <FiEye size={18} />
                </button>
                
                {agent.status === "pending" ? (
                  <>
                    <button 
                      onClick={() => updateStatus(agent.id, "active")}
                      className="flex items-center gap-2 rounded-xl bg-emerald-600/20 px-4 py-2 text-[10px] font-black uppercase text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white transition"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button 
                      onClick={() => updateStatus(agent.id, "rejected")}
                      className="flex items-center gap-2 rounded-xl bg-red-600/20 px-4 py-2 text-[10px] font-black uppercase text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition"
                    >
                      <FiX /> Reject
                    </button>
                  </>
                ) : (
                  // For REJECTED agents, remove Approve, only show Purge/Restore
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateStatus(agent.id, "pending")}
                      className="px-4 py-2 rounded-xl bg-white/5 text-[10px] font-black uppercase text-white/40 hover:text-white transition border border-white/5"
                    >
                      Restore to Pending
                    </button>
                    <button 
                      onClick={() => deleteAgent(agent.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                      title="Purge Record"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <hr className="border-white/5" />

      {/* ── SECTION 2: AGENT MANAGEMENT ── */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50">
              <FiUserCheck size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Active Registry</h2>
              <p className="text-[10px] text-white/40">Approved travel experts</p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">
              <tr>
                <th className="pb-4 px-4">Entity Node</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right pr-4">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {management.map((agent) => (
                <tr key={agent.id} className="group hover:bg-white/[0.02] transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-sm font-black text-white">
                        {agent.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{agent.name}</p>
                        <p className="text-[10px] text-white/30 uppercase font-black tracking-tighter">ID: {agent.id} • @{agent.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-1.5">
                       <FiCircle size={8} className={`fill-current ${agent.status === 'blocked' ? 'text-red-500' : 'text-emerald-500 animate-pulse'}`} />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${agent.status === 'blocked' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {agent.status}
                       </span>
                    </div>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => updateStatus(agent.id, "pending")}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-amber-500/20 hover:text-amber-400 transition"
                        title="Unapprove"
                      >
                        <FiClock size={14} />
                      </button>
                      <button 
                        onClick={() => sendMessageToAgent(agent)}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-blue-500/20 hover:text-blue-400 transition"
                        title="Direct Message"
                      >
                        <FiSend size={14} />
                      </button>
                      <button 
                        onClick={() => setSelectedAgent(agent)}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-purple-500/20 hover:text-purple-400 transition"
                        title="View Dossier"
                      >
                        <FiEye size={14} />
                      </button>
                      <button 
                        onClick={() => updateStatus(agent.id, agent.status === 'blocked' ? 'active' : 'blocked')}
                        className={`p-2 rounded-lg transition ${agent.status === 'blocked' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                      >
                        {agent.status === 'blocked' ? <FiUnlock size={14} /> : <FiLock size={14} />}
                      </button>
                      <button 
                         onClick={() => deleteAgent(agent.id)}
                         className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-500 transition"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── AGENT DETAIL MODAL ── */}
      <AnimatePresence>
        {selectedAgent && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAgent(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#12122a] shadow-3xl"
            >
              <div className="h-24 bg-gradient-to-r from-blue-600 to-purple-600 opacity-20" />
              <div className="px-8 pb-8">
                <div className="relative -mt-12 mb-6 flex justify-between items-end">
                  <div className="h-24 w-24 rounded-3xl bg-[#12122a] p-1 shadow-2xl">
                    <div className="h-full w-full rounded-2xl bg-white/5 flex items-center justify-center text-3xl font-black text-white border border-white/10">
                      {selectedAgent.name?.charAt(0)}
                    </div>
                  </div>
                  <button onClick={() => setSelectedAgent(null)} className="mb-2 p-2 rounded-full bg-white/5 text-white/40 hover:text-white"><FiX size={20} /></button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedAgent.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">ID: {selectedAgent.id}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Email</p>
                      <p className="text-[11px] text-white font-medium truncate">{selectedAgent.email}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Phone</p>
                      <p className="text-[11px] text-white font-medium">{selectedAgent.phone || 'N/A'}</p>
                    </div>
                  </div>

                  {selectedAgent.legal_paper_photo && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                       <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-3">Verification Docs</p>
                       <div className="grid grid-cols-2 gap-3">
                          <a href={selectedAgent.legal_paper_photo} target="_blank" rel="noreferrer" className="aspect-video rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group hover:bg-white/10 transition">
                            <FiEye className="text-blue-400 group-hover:scale-110 transition" />
                            <span className="text-[8px] mt-2 font-black uppercase">Permit</span>
                          </a>
                          <a href={selectedAgent.national_id_photo} target="_blank" rel="noreferrer" className="aspect-video rounded-xl bg-white/5 flex flex-col items-center justify-center border border-white/10 group hover:bg-white/10 transition">
                            <FiEye className="text-purple-400 group-hover:scale-110 transition" />
                            <span className="text-[8px] mt-2 font-black uppercase">ID Card</span>
                          </a>
                       </div>
                    </div>
                  )}

                  <div className="pt-4 flex gap-3">
                    <button 
                      onClick={() => sendMessageToAgent(selectedAgent)}
                      className="flex-1 py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl shadow-blue-600/20"
                    >
                      Communicate
                    </button>
                    <button 
                      onClick={() => setSelectedAgent(null)}
                      className="flex-1 py-4 bg-white/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/40"
                    >
                      Close Dossier
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
