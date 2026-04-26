"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiMap, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { tripsApi, friendlyApiMessage } from "../../../../lib/api";

export default function AgentHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tripsApi.get("/trips");
      const agentTrips = Array.isArray(data) ? data : [];
      // History shows missions that are not pending
      setHistory(agentTrips.filter(t => t.agentStatus && t.agentStatus !== "pending"));
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-teal-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black text-white">Trip History</h1>
        <p className="text-white/50">Your past accepted or declined missions.</p>
      </header>

      {history.length === 0 ? (
         <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center text-white/30 italic">
            You do not have any mission history yet.
         </div>
      ) : (
         <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] shadow-xl">
           <div className="overflow-x-auto">
             <table className="min-w-full text-left text-sm border-collapse">
               <thead>
                 <tr className="border-b border-white/10 bg-white/5">
                   <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Destination & ID</th>
                   <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Timeline</th>
                   <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-white/40">Final Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-white/5">
                 {history.map(m => (
                   <tr key={m.id} className="hover:bg-white/[0.03] transition-colors">
                     <td className="px-6 py-4">
                       <div className="flex items-center gap-3">
                         <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                           m.agentStatus === 'accepted' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                         }`}>
                           <FiMap size={18} />
                         </div>
                         <div>
                           <p className="font-bold text-white tracking-tight">{m.destination}</p>
                           <p className="text-[9px] font-mono text-white/30">ID: {m.id}</p>
                         </div>
                       </div>
                     </td>
                     <td className="px-6 py-4">
                        <span className="text-[11px] font-bold text-white/50">{m.startDate}</span>
                        <span className="mx-2 text-white/20">→</span>
                        <span className="text-[11px] font-bold text-white/50">{m.endDate}</span>
                     </td>
                     <td className="px-6 py-4">
                        {m.agentStatus === 'accepted' ? (
                           <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-500 ring-1 ring-emerald-500/20">
                             <FiCheckCircle size={12}/> Accepted
                           </span>
                        ) : (
                           <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-red-500 ring-1 ring-red-500/20">
                             <FiXCircle size={12}/> Declined
                           </span>
                        )}
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
         </div>
      )}
    </div>
  );
}
