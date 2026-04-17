"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiDollarSign, 
  FiMap, 
  FiPlusCircle, 
  FiClock, 
  FiBarChart2, 
  FiCalendar,
  FiTrendingUp,
  FiGlobe,
  FiCheckCircle,
  FiEye,
  FiActivity,
  FiShield,
  FiMessageSquare,
  FiSearch
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getApiUrl } from "../../lib/api";
import { UndoProvider } from "../../context/UndoContext";
import UndoPanel from "../../components/common/UndoPanel";
import ResponsiveNav from "../../components/common/ResponsiveNav";

// Dynamic import for charts to avoid SSR issues
const DashboardRecharts = dynamic(
  () => import("../../components/dashboard/DashboardRecharts"),
  { ssr: false }
);

export default function UserCommandCenter() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchUserData();
  }, [user, router]);

  const fetchUserData = async () => {
    try {
      const [tripsResponse, notificationsResponse] = await Promise.all([
        fetch(getApiUrl("/trips"), {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(getApiUrl("/notifications"), {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (tripsResponse.ok) {
        const resJson = await tripsResponse.json();
        setTrips(resJson.data || []);
      }

      if (notificationsResponse.ok) {
        const resJson = await notificationsResponse.json();
        const data = resJson.data || [];
        setNotifications(data.slice(0, 5));
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = trip.destination?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           trip.accommodation?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === "all" || trip.approvalStatus === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [trips, searchTerm, filterStatus]);

  const stats = useMemo(() => {
    const totalBudget = trips.reduce((sum, trip) => sum + (trip.budget || 0), 0);
    const upcoming = trips.filter(trip => new Date(trip.startDate) >= new Date()).length;
    const completed = trips.filter(trip => new Date(trip.endDate) < new Date()).length;
    
    return {
      totalTrips: trips.length,
      totalBudget,
      upcoming,
      completed,
    };
  }, [trips]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent shadow-lg shadow-blue-500/20" />
      </div>
    );
  }

  return (
    <UndoProvider>
      <div className="min-h-screen bg-[#0d0d1a] text-white">
        <ResponsiveNav 
          user={user} 
          onLogout={logout} 
          showNotifications={true} 
          notificationCount={notifications.length}
        />

        <main className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {/* Header Area */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white md:text-4xl uppercase">
                Traveler <span className="text-blue-400 text-glow">Dashboard</span>
              </h1>
              <p className="mt-2 text-sm text-white/50 font-medium">
                Welcome back, {user?.name}. Your global itineraries are synchronized.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/add-trip">
                <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-95">
                  <FiPlusCircle size={16} /> Plan New Mission
                </button>
              </Link>
            </div>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {[
              { label: "Total Voyages", val: stats.totalTrips, icon: FiMap, color: "from-blue-500/20", text: "text-blue-400", sub: "Lifetime trips" },
              { label: "Mission Capital", val: `$${stats.totalBudget.toLocaleString()}`, icon: FiDollarSign, color: "from-emerald-500/20", text: "text-emerald-400", sub: "Allocated budget" },
              { label: "Active Deployments", val: stats.upcoming, icon: FiCalendar, color: "from-amber-500/20", text: "text-amber-400", sub: "Upcoming trips" },
              { label: "Completed Operations", val: stats.completed, icon: FiCheckCircle, color: "from-purple-500/20", text: "text-purple-400", sub: "Past travels" },
            ].map((kpi, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#12122a] p-5 shadow-2xl transition hover:border-white/20"
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

          {/* Search & Tabs */}
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:col-span-2 flex-1 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
                  {["overview", "trips", "analytics", "messages"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setActiveTab(m)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition ${
                        activeTab === m 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                          : "text-white/40 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                
                <div className="relative group">
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-blue-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="SCAN TRIPS..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-bold uppercase tracking-widest text-white outline-none focus:border-blue-500/50 transition-all w-full sm:w-64"
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === "overview" && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Recent Trips Table-like View */}
                    <div className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl">
                      <div className="mb-6 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                          <FiActivity className="text-blue-400" /> RECENT DEPLOYMENTS
                        </h3>
                        <Link href="/trips" className="text-[10px] font-black text-white/30 hover:text-blue-400 uppercase tracking-widest transition">View All</Link>
                      </div>
                      <div className="space-y-4">
                        {trips.slice(0, 4).map((trip) => (
                          <div key={trip.id} className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02] transition hover:bg-white/[0.04]">
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black">
                                {trip.destination?.charAt(0)}
                              </div>
                              <div>
                                <p className="text-xs font-black text-white uppercase tracking-tight">{trip.destination}</p>
                                <p className="text-[10px] text-white/30 mt-0.5">{new Date(trip.startDate).toLocaleDateString()}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              trip.approvalStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                              trip.approvalStatus === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              {trip.approvalStatus}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl">
                        <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Protocol Support</h3>
                        <p className="text-xs text-white/40 leading-relaxed mb-6">Need assistance with your itinerary? Initiate a support transmission to our global dispatch team.</p>
                        <Link href="/contact">
                          <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition active:scale-95">
                            Contact Dispatch
                          </button>
                        </Link>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent p-6 shadow-2xl">
                        <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Discovery Hub</h3>
                        <p className="text-xs text-white/40 mb-6">Explore new destinations and expand your global footprint.</p>
                        <Link href="/about">
                          <button className="w-full py-3 bg-blue-600 text-[10px] font-black uppercase tracking-widest text-white rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-500 transition">
                            Explore Map
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "trips" && (
                  <motion.div
                    key="trips"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl overflow-x-auto"
                  >
                    <table className="w-full text-left text-xs">
                      <thead className="text-[10px] uppercase font-black text-white/20 border-b border-white/5">
                        <tr>
                          <th className="pb-3 px-2">Destination</th>
                          <th className="pb-3">Timeline</th>
                          <th className="pb-3">Budget</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredTrips.map((trip) => (
                          <tr key={trip.id} className="group transition hover:bg-white/[0.02]">
                            <td className="py-4 px-2">
                              <p className="font-black text-white uppercase tracking-tight">{trip.destination}</p>
                              <p className="text-[10px] text-white/30 uppercase">{trip.accommodation || "Standard Base"}</p>
                            </td>
                            <td className="py-4 text-white/50 font-medium">
                              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                            </td>
                            <td className="py-4 font-black text-blue-400">
                              ${(trip.budget || 0).toLocaleString()}
                            </td>
                            <td className="py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                                trip.approvalStatus === 'approved' ? 'bg-emerald-500/10 text-emerald-400' :
                                trip.approvalStatus === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-red-500/10 text-red-400'
                              }`}>
                                {trip.approvalStatus}
                              </span>
                            </td>
                            <td className="py-4 text-right">
                              <button className="p-2 rounded-lg bg-white/5 text-white/30 hover:text-white hover:bg-white/10 transition opacity-0 group-hover:opacity-100">
                                <FiEye />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}

                {activeTab === "analytics" && (
                  <motion.div
                    key="analytics"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl"
                  >
                    <h3 className="text-sm font-bold text-white mb-8 uppercase tracking-widest">Global Asset Telemetry</h3>
                    <div className="h-[400px]">
                      <DashboardRecharts 
                        lineData={[]} // Placeholder for actual logic
                        pieData={[]} 
                        pieColors={["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]} 
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar Oversight */}
            <div className="lg:w-80 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-transparent p-6 shadow-2xl backdrop-blur-sm"
              >
                <div className="mb-6 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/50 shadow-lg shadow-blue-500/10">
                    <FiShield size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Protocol Oversight</h3>
                    <p className="text-[10px] text-blue-400/60 font-medium">Personal Access Enabled</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">TELEMETRY</p>
                    <div className="flex justify-between items-end">
                      <span className="text-2xl font-black text-white">{(trips.length > 0 ? "STABLE" : "IDLE")}</span>
                      <FiActivity className="text-emerald-400 mb-1 animate-pulse" />
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-white/10 bg-white/5">
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-2">SYSTEM NOTIFICATIONS</p>
                    <div className="space-y-2">
                      {notifications.slice(0, 3).map((n, i) => (
                        <div key={i} className="text-[10px] text-white/50 flex gap-2">
                          <span className="text-blue-400">•</span>
                          <span className="truncate">{n.title}</span>
                        </div>
                      ))}
                      {notifications.length === 0 && <p className="text-[10px] text-white/20 italic">No alerts in queue</p>}
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="rounded-2xl border border-white/10 bg-[#12122a] p-6 shadow-2xl">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FiClock size={16} className="text-amber-400" /> MISSION UPDATES
                </h3>
                <div className="space-y-4">
                  {trips.filter(t => t.approvalStatus === 'pending').map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="h-1 w-1 rounded-full bg-amber-400 mt-2" />
                      <div>
                        <p className="text-[10px] font-black text-white uppercase">{t.destination}</p>
                        <p className="text-[9px] text-white/30 uppercase">Awaiting admin clearance</p>
                      </div>
                    </div>
                  ))}
                  {trips.filter(t => t.approvalStatus === 'pending').length === 0 && (
                    <p className="text-[10px] text-white/20 italic">All protocols cleared</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>

        <div className="fixed right-4 bottom-4 w-80 max-h-96 overflow-hidden z-50">
          <UndoPanel compact={true} maxItems={5} />
        </div>
      </div>
    </UndoProvider>
  );
}
