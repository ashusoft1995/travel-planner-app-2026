"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FiPlus, FiSearch, FiMapPin, FiCalendar, FiStar, FiArrowRight } from "react-icons/fi";
import { DESTINATION_DETAILS } from "../../lib/destinations";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function TripsPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState(null);

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
    <div className="page-shell py-12 min-h-screen bg-[var(--background)]">
      <div className="container">
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between py-8">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.3em] text-purple-500">
              Explorer
            </p>
            <h1 className="mt-2 text-4xl font-black text-[var(--text)] tracking-tight">
              Global <span className="text-purple-500">Destinations</span>
            </h1>
            <p className="mt-3 max-w-xl text-[var(--muted)] text-lg">
              Explore EthioTravel&apos;s curated catalog of world-class locations. Click any destination for live telemetry and details.
            </p>
          </div>
          <div className="flex gap-4">
            {user ? (
               <Link href="/add-trip">
                <span className="btn-primary inline-flex items-center gap-2 shadow-lg shadow-purple-500/20">
                  <FiPlus /> New Itinerary
                </span>
               </Link>
            ) : (
               <Link href="/login">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-bold text-white hover:bg-white/10 transition">
                  Sign in to plan
                </span>
               </Link>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-8 mb-12">
          <div className="relative max-w-2xl">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-purple-400 text-xl" />
            <input
              type="search"
              placeholder="Search by name, region or historical site..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-3xl border border-brand-900/10 bg-brand-50/50 dark:bg-white/5 py-5 pl-14 pr-6 text-brand-950 dark:text-white text-lg placeholder:text-brand-900/40 dark:placeholder:text-white/20 outline-none backdrop-blur focus:border-purple-500/50 transition-all shadow-xl dark:shadow-2xl"
              aria-label="Search destinations"
            />
          </div>
        </div>

        {/* Selection Detail Panel */}
        <AnimatePresence>
            {selectedDest && (
                <motion.div 
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: "auto", scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    className="mb-12 overflow-hidden rounded-[2.5rem] border border-purple-500/30 bg-purple-500/[0.03] backdrop-blur-xl shadow-3xl ring-1 ring-purple-500/20"
                >
                    <div className="flex justify-end p-4">
                        <button onClick={() => setSelectedDest(null)} className="text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-purple-400 transition">Close Briefing</button>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-0">
                        <div className="relative h-72 lg:h-auto min-h-[400px]">
                            <Image 
                                src={selectedDest.image || selectedDest.imageUrl} 
                                alt={selectedDest.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 to-transparent" />
                            <div className="absolute bottom-8 left-8">
                                <p className="text-xs font-black uppercase tracking-[0.2em] text-purple-400 mb-2">{selectedDest.region}</p>
                                <h2 className="text-4xl font-black text-white">{selectedDest.name}</h2>
                            </div>
                        </div>
                        <div className="p-10 space-y-6">
                            <p className="text-lg text-slate-300 leading-relaxed font-medium">{selectedDest.description}</p>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-2"><FiCalendar /> Seasonality</p>
                                    <p className="text-white font-bold">{selectedDest.bestMonths}</p>
                                </div>
                                <div className="p-4 rounded-3xl bg-white/5 border border-white/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1 flex items-center gap-2"><FiStar /> Recognition</p>
                                    <p className="text-white font-bold">{selectedDest.rating} / 5.0</p>
                                </div>
                            </div>

                            <p className="text-sm text-white/50 italic border-l-2 border-purple-500 px-4">{selectedDest.climateNote}</p>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                <span className="text-2xl font-black text-white">Value: <span className="text-purple-400">{selectedDest.price}</span></span>
                                <Link href={user ? `/add-trip?destination=${selectedDest.name}` : "/login"}>
                                    <span className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold hover:bg-purple-500 transition shadow-lg shadow-purple-600/20">
                                        Start Plan <FiArrowRight />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Destination Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDestinations.map((dest, i) => (
            <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => { setSelectedDest(dest); window.scrollTo({ top: 300, behavior: 'smooth' }); }}
                className="group relative cursor-pointer overflow-hidden rounded-[2rem] border border-white/10 bg-[#12122a] p-2 transition-all hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="relative h-56 overflow-hidden rounded-[1.6rem]">
                <Image
                  src={dest.image || dest.imageUrl}
                  alt={dest.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-950/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                   <p className="text-[10px] font-black uppercase tracking-widest text-purple-400">{dest.region}</p>
                   <p className="text-lg font-bold text-white">{dest.name}</p>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between text-xs font-bold text-white/40">
                  <span className="flex items-center gap-1"><FiMapPin /> GPS Tracked</span>
                  <span className="text-purple-400">{dest.price}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="py-24 text-center">
             <FiSearch className="mx-auto text-4xl text-white/10 mb-4" />
             <p className="text-xl font-bold text-white/30">No matching destinations protocol found</p>
             <button onClick={() => setQuery("")} className="mt-4 text-purple-400 font-bold hover:underline">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
}
