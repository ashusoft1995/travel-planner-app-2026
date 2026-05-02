"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiMap, FiClock, FiDollarSign } from "react-icons/fi";
import { tripsApi, friendlyApiMessage } from "../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AgentInboxPage() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const loadMissions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tripsApi.get("/trips");
      const agentTrips = Array.isArray(data) ? data : [];
      // Inbox only shows pending missions
      setMissions(agentTrips.filter(t => t.agentStatus === "pending"));
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMissions();
  }, [loadMissions]);

  const handleDecision = async (tripId, decision) => {
    try {
      await tripsApi.put(`/trips/${tripId}`, { agentStatus: decision });
      toast.success(`Mission ${decision} successfully`);
      setMissions(prev => prev.filter(t => t.id !== tripId));
      if (selected?.id === tripId) setSelected(null);
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

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
        <h1 className="text-3xl font-black text-white">Mission Inbox</h1>
        <p className="text-white/50">Review and accept new travel assignments dispatched by Admin.</p>
      </header>

      {missions.length === 0 ? (
         <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center text-white/30 italic">
            No pending missions in your inbox.
         </div>
      ) : (
         <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {missions.map(m => (
              <div key={m.id} className="rounded-2xl border border-teal-500/20 bg-teal-500/5 p-5 transition hover:bg-teal-500/10 cursor-pointer" onClick={() => setSelected(m)}>
                 <div className="flex items-center gap-3 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
                      <FiMap />
                    </div>
                    <div>
                      <h3 className="font-bold text-white tracking-tight">{m.destination}</h3>
                      <p className="text-[10px] font-mono text-teal-400/50">ID: {m.id}</p>
                    </div>
                 </div>
                 <div className="space-y-2 mb-6">
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40">Dates</span>
                       <span className="text-white/80 font-bold">{m.startDate} to {m.endDate}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40">Budget</span>
                       <span className="text-white/80 font-bold">{Number(m.budget||0).toLocaleString()} ETB</span>
                    </div>
                 </div>
                 <div className="flex gap-2">
                    <button 
                       onClick={(e) => { e.stopPropagation(); handleDecision(m.id, "accepted"); }}
                       className="flex-1 rounded-xl bg-teal-500/20 py-2.5 text-xs font-bold text-teal-400 hover:bg-teal-500 hover:text-white transition"
                    >
                       Accept
                    </button>
                    <button 
                       onClick={(e) => { e.stopPropagation(); handleDecision(m.id, "declined"); }}
                       className="flex-1 rounded-xl bg-red-500/10 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500 hover:text-white transition"
                    >
                       Decline
                    </button>
                 </div>
              </div>
            ))}
         </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelected(null)}
          >
             <motion.div 
               initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
               className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0d0d1a] p-8 shadow-2xl relative"
               onClick={e => e.stopPropagation()}
             >
                <button onClick={() => setSelected(null)} className="absolute right-6 top-6 text-white/30 hover:text-white"><FiX size={20}/></button>
                <div className="mb-6 flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400"><FiMap size={24}/></div>
                  <div>
                    <h2 className="text-xl font-black text-white">{selected.destination}</h2>
                    <p className="text-xs text-white/40">Traveler: {selected.ownerEmail}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="rounded-xl bg-white/5 p-3">
                     <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1">Timeframe</p>
                     <p className="text-sm font-bold text-white">{selected.startDate} <br/> {selected.endDate}</p>
                   </div>
                   <div className="rounded-xl bg-white/5 p-3">
                     <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1">Budget Allocation</p>
                     <p className="text-sm font-bold text-white">{Number(selected.budget).toLocaleString()} ETB</p>
                   </div>
                   <div className="rounded-xl bg-white/5 p-3 col-span-2">
                     <p className="text-[10px] uppercase text-white/40 tracking-widest mb-1">Accommodation</p>
                     <p className="text-sm font-bold text-white">{selected.accommodation || 'Flexible'}</p>
                   </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-white/10">
                   <button onClick={() => handleDecision(selected.id, "accepted")} className="flex-1 rounded-xl bg-teal-500 py-3 text-xs font-black uppercase tracking-widest text-[#0d0d1a] hover:bg-teal-400 transition">
                     Accept Mission
                   </button>
                   <button onClick={() => handleDecision(selected.id, "declined")} className="flex-1 rounded-xl border border-red-500/30 text-red-400 py-3 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition">
                     Decline
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
