"use client";

import { useEffect, useState } from "react";
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
  FiClock
} from "react-icons/fi";
import { tripsApi, friendlyApiMessage } from "../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentsPanel() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [msgInput, setMsgInput] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

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
      toast.success(`Agent Protocol Updated: ${status.toUpperCase()}`);
      fetchUsers();
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    }
  };

  const deleteAgent = async (id) => {
    if (!confirm("Are you sure you want to terminate this agent's contract?")) return;
    try {
      await tripsApi.delete(`/users/${id}`);
      toast.success("Agent contract terminated.");
      fetchUsers();
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    }
  };

  const sendMessage = async () => {
    if (!selectedAgent || !msgInput.trim()) return;
    setSendingMsg(true);
    try {
      await tripsApi.post("/internal-messages", {
        receiverId: selectedAgent.id,
        body: msgInput
      });
      toast.success(`Message transmitted to ${selectedAgent.name}`);
      setMsgInput("");
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    } finally {
      setSendingMsg(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg" />
        <p className="mt-4 text-xs font-black uppercase tracking-widest text-white/40">Synchronizing Agent Registry...</p>
      </div>
    );
  }

  const requested = agents.filter(a => a.status === "pending" || a.status === "rejected");
  const management = agents.filter(a => a.status === "active" || a.status === "blocked");

  return (
    <div className="space-y-12">
      {/* ── SECTION 1: AGENT REQUESTED ── */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/50">
              <FiClock size={20} />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Agent Requested</h2>
              <p className="text-[10px] text-white/40">Onboarding queue and validation</p>
            </div>
          </div>
          <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[10px] font-black text-amber-400 border border-amber-500/20">
            {requested.length} WAITING
          </span>
        </div>

        <div className="grid gap-4">
          {requested.map((agent) => (
            <motion.div 
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
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
                  <p className="text-[10px] text-white/30">{agent.email} • {agent.phone || 'No Phone'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setSelectedAgent(agent)}
                  className="p-2.5 rounded-xl bg-white/5 text-white/60 hover:text-white transition"
                  title="View Credentials"
                >
                  <FiEye size={18} />
                </button>
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
                {agent.status === 'rejected' && (
                  <button 
                    onClick={() => updateStatus(agent.id, "pending")}
                    className="p-2.5 rounded-xl bg-white/5 text-white/40 hover:text-white transition"
                    title="Move to Pending"
                  >
                    <FiClock size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
          {requested.length === 0 && (
            <div className="py-12 text-center border border-dashed border-white/10 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">No pending requests in queue</p>
            </div>
          )}
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
              <h2 className="text-sm font-black uppercase tracking-widest text-white">Agent Management</h2>
              <p className="text-[10px] text-white/40">Active protocols and oversight</p>
            </div>
          </div>
          <span className="rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-black text-blue-400 border border-blue-500/20">
            {management.length} ACTIVE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-white/30">
              <tr>
                <th className="pb-4 px-4">Agent Entity</th>
                <th className="pb-4">Expertise</th>
                <th className="pb-4">Status</th>
                <th className="pb-4 text-right pr-4">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {management.map((agent) => (
                <tr key={agent.id} className="group hover:bg-white/[0.02] transition">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-sm font-black text-white">
                          {agent.name?.charAt(0)}
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-3 w-3 rounded-full border-2 border-[#0d0d1a] bg-emerald-500" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-white">{agent.name}</p>
                        <p className="text-[10px] text-white/30 uppercase font-bold tracking-tighter">ID: {agent.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(agent.expertise) ? agent.expertise : []).slice(0, 2).map((exp, i) => (
                        <span key={i} className="text-[9px] bg-white/5 px-2 py-0.5 rounded-lg text-white/60">{exp}</span>
                      ))}
                      {agent.expertise?.length > 2 && <span className="text-[9px] text-white/30">+{agent.expertise.length - 2}</span>}
                    </div>
                  </td>
                  <td className="py-4 text-[10px] font-black uppercase tracking-widest">
                    <span className={agent.status === 'blocked' ? 'text-red-400' : 'text-emerald-400'}>
                      {agent.status}
                    </span>
                  </td>
                  <td className="py-4 text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => updateStatus(agent.id, "pending")}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-amber-500/20 hover:text-amber-400 transition"
                        title="Unapprove (Move to Requests)"
                      >
                        <FiClock size={14} />
                      </button>
                      <button 
                        onClick={() => { setSelectedAgent(agent); setMsgInput(""); }}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-blue-500/20 hover:text-blue-400 transition"
                        title="Direct Message"
                      >
                        <FiSend size={14} />
                      </button>
                      <button 
                        onClick={() => setSelectedAgent(agent)}
                        className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-purple-500/20 hover:text-purple-400 transition"
                        title="View Full Profile"
                      >
                        <FiEye size={14} />
                      </button>
                      <button 
                        onClick={() => updateStatus(agent.id, agent.status === 'blocked' ? 'active' : 'blocked')}
                        className={`p-2 rounded-lg transition ${agent.status === 'blocked' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'}`}
                        title={agent.status === 'blocked' ? 'Unblock' : 'Block Access'}
                      >
                        <FiSlash size={14} />
                      </button>
                      <button 
                         onClick={() => deleteAgent(agent.id)}
                         className="p-2 rounded-lg bg-white/5 text-white/40 hover:bg-red-500/20 hover:text-red-500 transition"
                         title="Terminate Contract"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {management.length === 0 && (
            <div className="py-12 text-center italic text-white/20 text-sm">No active agents in registry</div>
          )}
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
                  <button onClick={() => setSelectedAgent(null)} className="mb-2 p-2 rounded-full bg-white/5 text-white/40 hover:text-white"><FiX /></button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-black text-white">{selectedAgent.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">Expert / Travel Consultant</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Electronic Mail</p>
                      <p className="text-[11px] text-white font-medium truncate">{selectedAgent.email}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-1">Telecom Line</p>
                      <p className="text-[11px] text-white font-medium">{selectedAgent.phone || 'N/A'}</p>
                    </div>
                  </div>

                  {selectedAgent.about && (
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                      <p className="text-[8px] font-black uppercase text-white/30 tracking-widest mb-2">About Agent</p>
                      <p className="text-xs text-white/60 leading-relaxed italic">"{selectedAgent.about}"</p>
                    </div>
                  )}

                  <div className="p-4 rounded-2xl bg-blue-600/5 border border-blue-500/20">
                     <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-3 flex items-center gap-2">
                       <FiSend /> Transmission Protocol
                     </p>
                     <div className="flex gap-2">
                       <input 
                         value={msgInput}
                         onChange={e => setMsgInput(e.target.value)}
                         placeholder="Type encrypted message..."
                         className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-blue-500"
                       />
                       <button 
                         disabled={sendingMsg || !msgInput.trim()}
                         onClick={sendMessage}
                         className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition disabled:opacity-50"
                       >
                         <FiSend size={18} />
                       </button>
                     </div>
                  </div>

                  {selectedAgent.legal_paper_photo && (
                    <div className="grid grid-cols-2 gap-3">
                       <a href={selectedAgent.legal_paper_photo} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white/60 hover:bg-white/10 transition">
                         <FiEye /> View License
                       </a>
                       <a href={selectedAgent.national_id_photo} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase text-white/60 hover:bg-white/10 transition">
                         <FiUser /> View ID Card
                       </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
