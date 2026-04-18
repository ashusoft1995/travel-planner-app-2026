"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { 
  FiPlus, FiSearch, FiMapPin, FiCalendar, FiStar, 
  FiArrowRight, FiX, FiActivity, FiNavigation, FiHome, FiDollarSign 
} from "react-icons/fi";
import { DESTINATION_DETAILS } from "../../lib/destinations";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

function TripsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState(null);

  useEffect(() => {
    const destName = searchParams.get("destination");
    if (destName) {
      const found = DESTINATION_DETAILS.find(d => d.name.toLowerCase() === destName.toLowerCase());
      if (found) setSelectedDest(found);
    }
  }, [searchParams]);

  const filteredDestinations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DESTINATION_DETAILS;
    return DESTINATION_DETAILS.filter(d => 
      d.name.toLowerCase().includes(q) || 
      d.region.toLowerCase().includes(q) ||
      (d.aliases || []).some(a => a.toLowerCase().includes(q))
    );
  }, [query]);

  return (
    <div className="page-shell py-12 min-h-screen bg-[#06060c]">
      <div className="container">
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between py-12">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-black uppercase tracking-[0.4em] text-purple-500 mb-2">
              Explorer Protocol
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl lg:text-7xl font-black text-white tracking-tighter uppercase">
              Global <span className="text-purple-500">Node</span> Network
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 max-w-xl text-white/40 text-lg font-medium">
              Access real-time telemetry and architectural briefings for 25+ iconic Ethiopian coordinates.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4">
            {user ? (
               <Link href="/add-trip">
                <button className="px-8 py-4 rounded-2xl bg-purple-600 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                  <FiPlus /> Initialize Itinerary
                </button>
               </Link>
            ) : (
               <Link href="/login">
                <button className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">
                  Sync Identity to Plan
                </button>
               </Link>
            )}
          </motion.div>
        </div>

        {/* Search Interface */}
        <div className="mt-8 mb-16">
          <div className="relative max-w-3xl group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-purple-500/50 group-focus-within:text-purple-400 transition-colors" size={24} />
            <input
              type="search"
              placeholder="Query destination node, region, or historic landmark..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-[2rem] border border-white/5 bg-white/[0.03] py-6 pl-16 pr-8 text-white text-lg font-bold placeholder:text-white/20 outline-none backdrop-blur-3xl focus:border-purple-500/30 transition-all shadow-2xl"
            />
          </div>
        </div>

        {/* Destination Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDestinations.map((dest, i) => (
            <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => setSelectedDest(dest)}
                className="group relative cursor-pointer overflow-hidden rounded-[2.5rem] border border-white/5 bg-[#0d0d1a] p-3 transition-all hover:border-purple-500/30 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="relative h-64 overflow-hidden rounded-[1.8rem]">
                <Image
                  src={dest.image || dest.imageUrl}
                  alt={dest.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d1a] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 mb-1">{dest.region}</p>
                   <p className="text-2xl font-black text-white uppercase tracking-tighter">{dest.name}</p>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-white/30 uppercase tracking-widest">
                  <FiMapPin className="text-purple-500" /> Active Node
                </div>
                <span className="text-sm font-black text-accent-yellow">{dest.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedDest && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDest(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-xl"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-[3rem] bg-[#0d0d1a] border border-white/10 shadow-3xl grid lg:grid-cols-2"
              >
                <button 
                  onClick={() => setSelectedDest(null)}
                  className="absolute top-8 right-8 z-50 p-3 rounded-full bg-black/50 text-white/50 hover:text-white transition backdrop-blur-md border border-white/10"
                >
                  <FiX size={24} />
                </button>

                {/* Left: Visuals & Map */}
                <div className="relative flex flex-col h-full bg-[#080814]">
                   <div className="relative h-1/2">
                      <Image src={selectedDest.image} alt={selectedDest.name} fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#080814] via-transparent to-transparent" />
                      <div className="absolute bottom-8 left-8">
                        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 text-[10px] font-black uppercase tracking-widest mb-4 inline-block">Transmission Active</span>
                        <h2 className="text-5xl font-black text-white uppercase tracking-tighter">{selectedDest.name}</h2>
                      </div>
                   </div>
                   <div className="flex-1 p-8">
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-4 flex items-center gap-2"><FiActivity /> Geographic Telemetry</h4>
                      <div className="h-full rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
                         {/* Mock Map Placeholder */}
                         <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                         <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                               <FiNavigation size={48} className="text-purple-500 mb-4 mx-auto animate-pulse" />
                               <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Coordinate Lock: {selectedDest.lat}, {selectedDest.lng}</p>
                               <p className="text-2xl font-black text-white mt-2 uppercase">{selectedDest.distanceKm} KM From Capital</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Right: Rich Details */}
                <div className="p-10 lg:p-16 overflow-y-auto custom-scrollbar space-y-12">
                   <div className="space-y-4">
                      <p className="text-xl text-white/70 font-medium leading-relaxed italic border-l-4 border-purple-500 pl-6">
                        "{selectedDest.description}"
                      </p>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                         <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Climate Protocol</p>
                         <p className="text-white font-bold">{selectedDest.avgTempDry}</p>
                         <p className="text-[10px] text-white/30 mt-1 uppercase">{selectedDest.climateNote}</p>
                      </div>
                      <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10">
                         <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">Optimal Window</p>
                         <p className="text-white font-bold">{selectedDest.bestMonths}</p>
                         <p className="text-[10px] text-white/30 mt-1 uppercase">High Season Priority</p>
                      </div>
                   </div>

                   <div>
                      <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6 flex items-center gap-2"><FiHome /> Recommended Lodging Nodes</h4>
                      <div className="space-y-3">
                         {selectedDest.hotels?.map((hotel, idx) => (
                           <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/10 transition-colors">
                              <span className="text-xs font-black text-white uppercase tracking-widest">{hotel}</span>
                              <span className="text-[10px] font-bold text-purple-400 uppercase">Premium Select</span>
                           </div>
                         ))}
                      </div>
                   </div>

                   <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Asset Allocation</p>
                         <p className="text-3xl font-black text-accent-yellow">{selectedDest.price}</p>
                      </div>
                      <Link href={user ? `/add-trip?destination=${encodeURIComponent(selectedDest.name)}` : "/login"}>
                         <button className="px-10 py-5 rounded-2xl bg-purple-600 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-purple-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                           Initialize Deployment <FiArrowRight />
                         </button>
                      </Link>
                   </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {filteredDestinations.length === 0 && (
          <div className="py-32 text-center">
             <FiSearch className="mx-auto text-6xl text-slate-100 dark:text-white/5 mb-6" />
             <p className="text-2xl font-black text-slate-300 dark:text-white/20 uppercase tracking-widest">No destinations found</p>
             <button onClick={() => setQuery("")} className="mt-6 text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs hover:underline transition-all">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function TripsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white dark:bg-[#06060c] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent shadow-lg shadow-blue-600/20"></div>
      </div>
    }>
      <TripsContent />
    </Suspense>
  );
}
