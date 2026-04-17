"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiCalendar,
  FiBriefcase,
  FiTrendingUp,
  FiActivity,
  FiShield,
  FiClock,
  FiDollarSign,
  FiSend,
  FiMessageSquare,
  FiMap
} from "react-icons/fi";
import AgentStats from "../../components/agent/AgentStats";
import AgentTripsWithProfit from "../../components/agent/AgentTripsWithProfit";
import AgentMessages from "../../components/agent/AgentMessages";
import AgentProfile from "../../components/agent/AgentProfile";

export default function AgentCommandCenter() {
  const { user, token } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "agent") {
      router.push("/login");
      return;
    }
  }, [user, router]);

  if (!user || user.role !== "agent") return null;

  return (
    <main className="min-h-screen bg-[#0d0d1a] text-white pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl uppercase">
              Agent <span className="text-purple-400 text-glow">Terminal</span>
            </h1>
            <p className="mt-2 text-sm text-white/50 font-medium">
              Welcome back, Agent {user?.name}. Operational oversight is active.
            </p>
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-white/10 active:scale-95">
               <FiActivity size={14} className="text-purple-400" /> Sync Comms
             </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/5 mb-10">
           {['overview', 'trips', 'messages', 'profile'].map(m => (
             <button 
               key={m} 
               onClick={() => setActiveTab(m)}
               className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${activeTab === m ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
             >
               {m}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  {/* KPI-style Stats integrated directly or via component */}
                  <AgentStats />
                  
                  <div className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl">
                    <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest flex items-center gap-2">
                      <FiTrendingUp className="text-purple-400" /> Asset Flow & Commission
                    </h3>
                    <AgentTripsWithProfit />
                  </div>
                </motion.div>
              )}

              {activeTab === 'trips' && (
                <motion.div
                  key="trips"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl"
                >
                  <AgentTripsWithProfit />
                </motion.div>
              )}

              {activeTab === 'messages' && (
                <motion.div
                  key="messages"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl h-[600px] flex flex-col"
                >
                  <AgentMessages />
                </motion.div>
              )}

              {activeTab === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl"
                >
                  <AgentProfile />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar Oversight */}
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
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Agent Oversight</h3>
                    <p className="text-[10px] text-purple-400/60 font-medium">{user.name} Control Mode</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">TELEMETRY</p>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-black text-white uppercase">Active</span>
                      <FiActivity className="text-emerald-400 mb-1 animate-pulse" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Quick Stats</p>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs">
                         <span className="text-white/50">Client Base</span>
                         <span className="font-bold text-blue-400">Stable</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                         <span className="text-white/50">Uptime</span>
                         <span className="font-bold text-emerald-400">99.9%</span>
                      </div>
                    </div>
                  </div>
                </div>
             </motion.div>

             <div className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FiClock size={16} className="text-amber-400" /> SYSTEM STATUS
                </h3>
                <div className="space-y-3">
                   <div className="flex justify-between text-[10px] font-bold text-white/40">
                      <span>SYNC STATUS</span>
                      <span className="text-emerald-400">ENCRYPTED</span>
                   </div>
                   <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        animate={{ x: [-100, 100] }} 
                        transition={{ repeat: Infinity, duration: 3, ease: "linear" }} 
                        className="h-full w-1/4 bg-purple-500/50 blur-sm" 
                      />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </main>
  );
}
