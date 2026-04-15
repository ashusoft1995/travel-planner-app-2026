"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  FiUsers, 
  FiMap, 
  FiDollarSign, 
  FiSend, 
  FiTrendingUp, 
  FiActivity, 
  FiShield, 
  FiClock, 
  FiMail,
  FiEdit3,
  FiTrash2
} from "react-icons/fi";
import { 
  tripsApi, 
  fetchAdminTravelRequests, 
  fetchAdminContactMessages, 
  friendlyApiMessage 
} from "../../../lib/api";
import { useAuth } from "../../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import ProfitDashboard from "../../../components/admin/ProfitDashboard";
import DestinationManager from "../../../components/admin/DestinationManager";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar,
  Cell
} from "recharts";

const SUPER_ADMIN = "ashu";

export default function AdminCommandCenter() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: [],
    trips: [],
    requests: [],
    messages: [],
    activityLogs: [],
    internalMessages: []
  });
  const [loading, setLoading] = useState(true);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [msgInput, setMsgInput] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState(null);
  const [viewMode, setViewMode] = useState("users"); // users, activity, messages, profit

  const isSuperAdmin = user?.username?.toLowerCase() === SUPER_ADMIN;

  const loadAllData = useCallback(async () => {
    setLoading(true);
    try {
      const [uRes, tRes, rRes, mRes, logRes, intMsgRes] = await Promise.all([
        tripsApi.get("/users"),
        tripsApi.get("/trips"),
        fetchAdminTravelRequests(),
        fetchAdminContactMessages(),
        tripsApi.get("/activity-logs"),
        tripsApi.get("/internal-messages")
      ]);

      setStats({
        users: Array.isArray(uRes.data) ? uRes.data : [],
        trips: Array.isArray(tRes.data) ? tRes.data : [],
        requests: Array.isArray(rRes.data) ? rRes.data : [],
        messages: Array.isArray(mRes.data) ? mRes.data : [],
        activityLogs: Array.isArray(logRes.data) ? logRes.data : [],
        internalMessages: Array.isArray(intMsgRes.data) ? intMsgRes.data : []
      });
    } catch (e) {
      toast.error("System sync failed: " + friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const handleUpdateUserStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "blocked" ? "active" : "blocked";
    try {
      await tripsApi.patch(`/users/${id}`, { status: nextStatus });
      toast.success(`User ${nextStatus === "blocked" ? "blocked" : "reactivated"}`);
      loadAllData();
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const handleSendInternalMessage = async () => {
    if (!selectedRecipient || !msgInput.trim()) return;
    setSendingMsg(true);
    try {
      await tripsApi.post("/internal-messages", {
        receiverId: selectedRecipient.id,
        body: msgInput
      });
      toast.success("CMessage Transmitted");
      setMsgInput("");
      loadAllData();
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setSendingMsg(false);
    }
  };

  const totalBudget = stats.trips.reduce((acc, t) => acc + (Number(t.budget) || 0), 0);
  const pendingRequests = stats.requests.filter(r => r.status === "pending").length;
  const managers = stats.users.filter(u => u.role === "admin" && u.id !== user.id);
  const agents = stats.users.filter(u => u.role === "agent");

  if (loading && stats.users.length === 0) {
    return <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg shadow-purple-500/20" />
    </div>;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* ── Welcome Area ── */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Command <span className="text-purple-400 text-glow">Center</span>
          </h1>
          <p className="mt-2 text-sm text-white/50">
            {isSuperAdmin ? "Welcome back, Super Admin Ashu. Full system override enabled." : "System oversight and traveler management gateway."}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={loadAllData} className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10 active:scale-95">
             <FiActivity size={14} className="text-purple-400" /> Sync Live Data
           </button>
        </div>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Asset Flow", val: `$${totalBudget.toLocaleString()}`, icon: FiDollarSign, color: "from-emerald-500/20", text: "text-emerald-400", sub: "Global trip budget" },
          { label: "Active Travelers", val: stats.users.length, icon: FiUsers, color: "from-blue-500/20", text: "text-blue-400", sub: "Registered accounts" },
          { label: "Security Oversight", val: stats.trips.length, icon: FiMap, color: "from-purple-500/20", text: "text-purple-400", sub: "Itineraries tracked" },
          { label: "Pending Orders", val: pendingRequests, icon: FiSend, color: "from-amber-500/20", text: "text-amber-400", sub: "Awaiting approval" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12122a] p-5 shadow-2xl transition hover:border-white/20`}
          >
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br ${kpi.color} to-transparent blur-2xl opacity-50 transition group-hover:scale-110`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">{kpi.label}</p>
                <p className="mt-1 text-2xl font-black text-white">{kpi.val}</p>
                <p className="mt-1 text-[10px] text-white/30">{kpi.sub}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 ${kpi.text} ring-1 ring-white/10 transition group-hover:bg-white/10 group-hover:scale-110`}>
                <kpi.icon size={22} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
         {['users', 'activity', 'cmessages', 'profit', 'destinations'].map(m => (
           <button 
             key={m} 
             onClick={() => setViewMode(m)}
             className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${viewMode === m ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
           >
             {m === 'cmessages' ? 'CMessage' : m}
           </button>
         ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
             {viewMode === 'users' && (
               <motion.section 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 exit={{ opacity: 0, y: -10 }}
                 className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl"
               >
                 <div className="mb-6 flex items-center justify-between">
                   <h3 className="text-sm font-bold text-white flex items-center gap-2">
                     <FiUsers className="text-blue-400" /> User & Staff Registry
                   </h3>
                   <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{stats.users.length} Total</span>
                 </div>
                 
                 <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] uppercase font-black text-white/20 border-b border-white/5">
                        <tr>
                          <th className="pb-3 px-2">Entity</th>
                          <th className="pb-3">Role</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {stats.users.map(u => (
                          <tr key={u.id} className="group transition hover:bg-white/[0.02]">
                            <td className="py-4 px-2">
                              <div className="flex items-center gap-3">
                                <div className={`h-8 w-8 rounded-lg ${u.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : u.role === 'agent' ? 'bg-blue-500/20 text-blue-400' : 'bg-white/10 text-white/50'} flex items-center justify-center font-bold`}>
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <p className="font-bold text-white truncate">{u.name}</p>
                                  <p className="text-[10px] text-white/30 truncate">{u.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : u.role === 'agent' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-white/30'}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-4">
                              <span className={`flex items-center gap-1.5 text-[10px] font-bold ${u.status === 'blocked' ? 'text-red-400' : 'text-emerald-400'}`}>
                                <span className={`h-1.5 w-1.5 rounded-full ${u.status === 'blocked' ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} />
                                {u.status || 'active'}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                               <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {u.id !== user.id && (
                                    <button 
                                      onClick={() => handleUpdateUserStatus(u.id, u.status)}
                                      className={`p-2 rounded-lg text-xs font-bold transition ${u.status === 'blocked' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' : 'bg-red-500/10 text-red-400 hover:bg-red-500/20'}`}
                                      title={u.status === 'blocked' ? 'Reactivate' : 'Block Access'}
                                    >
                                      {u.status === 'blocked' ? <FiActivity /> : <FiShield />}
                                    </button>
                                  )}
                                  <button onClick={() => setSelectedRecipient(u)} className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                                    <FiMail />
                                  </button>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
               </motion.section>
             )}

             {viewMode === 'activity' && (
               <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl"
               >
                 <div className="mb-6">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <FiClock className="text-amber-400" /> System Activity Log
                    </h3>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Audit trail of all administrative protocol</p>
                 </div>
                 <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                   {stats.activityLogs.map((log) => (
                      <div key={log.id} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.02] transition hover:bg-white/[0.04]">
                         <div className={`mt-1 h-8 w-8 rounded-lg flex-shrink-0 flex items-center justify-center text-xs font-bold ${log.actorRole === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'}`}>
                           {log.actorName?.charAt(0)}
                         </div>
                         <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                               <p className="text-xs font-bold text-white truncate">{log.actorName} <span className="text-white/30 font-medium">({log.actorRole})</span></p>
                               <span className="text-[9px] text-white/20 font-medium">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="mt-1 text-xs text-slate-300 leading-relaxed capitalize">
                               <span className="text-purple-400 font-bold">{log.action}</span> - {log.targetType} <span className="text-[10px] font-mono text-white/40">#{log.targetId?.slice(-6)}</span>
                            </p>
                            {log.details && <p className="mt-2 text-[10px] py-1.5 px-3 rounded-lg bg-black/40 text-white/40 border border-white/5">{log.details}</p>}
                         </div>
                      </div>
                   ))}
                   {stats.activityLogs.length === 0 && <div className="text-center py-20 text-white/20 italic text-sm">No activity recorded yet</div>}
                 </div>
               </motion.section>
             )}

             {viewMode === 'cmessages' && (
               <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl h-[600px] flex flex-col"
               >
                 <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <FiSend className="text-purple-400" /> CMessage Channel
                      </h3>
                      <p className="text-[10px] text-white/40 uppercase tracking-widest mt-1">Direct communication with agents & admins</p>
                    </div>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                    {stats.internalMessages.map(msg => {
                      const isMe = msg.senderId === user.id;
                      return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[80%] rounded-2xl p-4 ${isMe ? 'bg-purple-600/20 text-white border border-purple-500/30 ring-1 ring-purple-500/20' : 'bg-white/5 text-slate-300 border border-white/10'}`}>
                              {!isMe && <p className="text-[9px] font-black uppercase text-purple-400 mb-1">{msg.senderName}</p>}
                              <p className="text-xs leading-relaxed">{msg.body}</p>
                              <div className={`mt-2 text-[8px] font-medium opacity-40 ${isMe ? 'text-right' : 'text-left'}`}>
                                 {new Date(msg.createdAt).toLocaleTimeString()}
                              </div>
                           </div>
                        </div>
                      );
                    })}
                    {stats.internalMessages.length === 0 && <div className="text-center py-20 text-white/20 italic text-sm">Transmission history is clear</div>}
                 </div>

                 {selectedRecipient && (
                    <div className="mt-6 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between mb-3 px-1">
                           <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">
                             Recipient: <span className="text-white">{selectedRecipient.name}</span>
                           </p>
                           <button onClick={() => setSelectedRecipient(null)} className="text-[10px] font-black uppercase text-white/30 hover:text-red-400 transition">Cancel</button>
                        </div>
                        <div className="flex gap-2 p-2 rounded-2xl bg-white/5 border border-white/10">
                           <input 
                              value={msgInput}
                              onChange={e => setMsgInput(e.target.value)}
                              onKeyDown={e => e.key === 'Enter' && handleSendInternalMessage()}
                              placeholder="Type transmission..."
                              className="flex-1 bg-transparent border-0 text-sm text-white py-2 outline-none px-2"
                           />
                           <button 
                             disabled={sendingMsg || !msgInput.trim()}
                             onClick={handleSendInternalMessage}
                             className="rounded-xl bg-purple-600 p-2 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-500 transition disabled:opacity-50"
                           >
                              <FiSend size={18} />
                           </button>
                        </div>
                    </div>
                 )}
                 {!selectedRecipient && (
                   <div className="mt-6 p-4 rounded-xl border border-dashed border-white/10 text-center">
                      <p className="text-[10px] text-white/30 uppercase font-black tracking-widest">Select a user from Registry to begin CMessage transmission</p>
                   </div>
                 )}
               </motion.section>
             )}

            {viewMode === 'profit' && (
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
              >
                <ProfitDashboard />
              </motion.section>
            )}

            {viewMode === 'destinations' && (
              <motion.section 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-white/10 bg-white p-6 shadow-2xl"
              >
                <DestinationManager />
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* ── Sidebar Oversight ── */}
        <div className="space-y-6">
           <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-transparent p-6 shadow-2xl backdrop-blur-sm"
           >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400 ring-1 ring-purple-500/50 shadow-lg shadow-purple-500/10">
                  <FiShield size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest">Protocol Oversight</h3>
                  <p className="text-[10px] text-purple-400/60 font-medium">{user.name} Control Mode</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                   <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-3">System Broadcast</p>
                   <div className="flex flex-col gap-2">
                      <input 
                        id="quick-broadcast-title"
                        placeholder="Protocol Title..."
                        className="bg-transparent border-b border-white/10 text-xs text-white py-1 outline-none focus:border-purple-500 transition-colors"
                      />
                      <textarea 
                        id="quick-broadcast-body"
                        placeholder="Internal instruction..."
                        className="bg-transparent border-b border-white/10 text-xs text-white py-1 outline-none focus:border-purple-500 transition-colors resize-none h-12"
                      />
                      <button 
                        onClick={async () => {
                          const title = document.getElementById('quick-broadcast-title').value;
                          const body = document.getElementById('quick-broadcast-body').value;
                          if (!title || !body) { toast.error("Missing Protocol Data"); return; }
                          try {
                            const { postNotification } = await import("../../../lib/api");
                            await postNotification({ title, body, audience: "admin" });
                            toast.success("Broadcast Synchronized");
                            document.getElementById('quick-broadcast-title').value = "";
                            document.getElementById('quick-broadcast-body').value = "";
                            loadAllData();
                          } catch (e) { toast.error("Transmission Failed"); }
                        }}
                        className="mt-2 w-full py-2 bg-purple-600 hover:bg-purple-500 text-[10px] font-black uppercase text-white rounded-lg transition-all active:scale-95"
                      >
                         Initiate Broadcast
                      </button>
                   </div>
                </div>

                <div className="pt-2 border-t border-white/5">
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Registry Summary</p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                       <span className="text-white/50">Active Managers</span>
                       <span className="font-bold text-purple-400">{managers.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                       <span className="text-white/50">Operational Agents</span>
                       <span className="font-bold text-blue-400">{agents.length}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 py-3 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-white/10 active:scale-95">
                   Configure System Permissions
                </button>
              </div>
           </motion.div>

           <div className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl overflow-hidden flex flex-col">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-widest">
                <FiActivity size={16} className="text-emerald-400" /> Live Telemetry
              </h3>
            </div>
            <div className="space-y-4">
               <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between text-[10px] font-bold text-white/40 mb-2">
                     <span>NETWORK STABILITY</span>
                     <span className="text-emerald-400">OPTIMAL</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                     <motion.div animate={{ x: [-100, 100] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="h-full w-1/3 bg-emerald-500/50 blur-sm" />
                  </div>
               </div>
               <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between text-[10px] font-bold text-white/40 mb-2">
                     <span>GLOBAL ASSET FLOW</span>
                     <span className="text-purple-400">+$2.4k (Today)</span>
                  </div>
                  <div className="h-24 w-full opacity-60">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          {v: 20}, {v: 45}, {v: 30}, {v: 60}, {v: 40}, {v: 80}, {v: 65}
                        ]}>
                           <Area type="monotone" dataKey="v" stroke="#a855f7" fill="#a855f720" strokeWidth={2} />
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </div>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
}
