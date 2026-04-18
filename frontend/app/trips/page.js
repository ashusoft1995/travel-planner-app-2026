"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { 
  FiPlus, FiSearch, FiMapPin, FiCalendar, FiStar, 
  FiArrowRight, FiX, FiActivity, FiNavigation, FiHome, FiDollarSign 
} from "react-icons/fi";
import { DESTINATION_DETAILS } from "../../lib/destinations";
import { useAuth } from "../../context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

function TripsContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedDest, setSelectedDest] = useState(null);
  const [viewMode, setViewMode] = useState("photo"); // "photo" or "map"

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
    <div className="page-shell py-12 min-h-screen bg-[#f8faff] dark:bg-[var(--bg)]">
      <div className="container">
        {/* Header Section */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between py-12">
          <div>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-2">
              Curated Catalog
            </motion.p>
            <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl lg:text-7xl font-black text-[#051128] dark:text-white tracking-tighter uppercase">
              Iconic <span className="text-blue-600">Destinations</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-6 max-w-xl text-slate-500 dark:text-white/40 text-lg font-medium">
              Explore 25+ iconic Ethiopian coordinates, with rich cultural heritage and breathtaking landscapes.
            </motion.p>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex gap-4">
            {user ? (
               <Link href="/add-trip">
                <button className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-2xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                  <FiPlus /> Plan a Trip
                </button>
               </Link>
            ) : (
               <Link href="/login">
                <button className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-600/30 hover:bg-blue-500 hover:scale-105 transition-all flex items-center justify-center">
                  Log in to Plan
                </button>
               </Link>
            )}
          </motion.div>
        </div>

        {/* Discovery Display (Top Level Detail View) */}
        <AnimatePresence mode="wait">
          {selectedDest && (
            <motion.div 
              key="selected-display"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-24 relative overflow-hidden rounded-[4rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-3xl"
            >
              <div className="grid lg:grid-cols-2">
                {/* Left: Visuals & Map */}
                <div className="relative h-[500px] lg:h-auto overflow-hidden bg-slate-100 dark:bg-slate-950">
                   {viewMode === "photo" ? (
                      <>
                        <Image src={selectedDest.image} alt={selectedDest.name} fill className="object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </>
                   ) : (
                      <iframe
                        title="Destination Map"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        src={`https://www.google.com/maps?q=${selectedDest.lat},${selectedDest.lng}&z=12&output=embed`}
                        className="grayscale invert dark:grayscale-0 dark:invert-0 opacity-80"
                      />
                   )}
                   
                   {/* Map/Photo Toggle */}
                   <div className="absolute top-8 left-8 flex gap-2">
                      <button 
                        onClick={() => setViewMode("photo")}
                        className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${viewMode === "photo" ? "bg-blue-600 text-white shadow-lg" : "bg-white/20 text-white backdrop-blur-md border border-white/20"}`}
                      >
                        Photo
                      </button>
                      <button 
                        onClick={() => setViewMode("map")}
                        className={`px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all ${viewMode === "map" ? "bg-blue-600 text-white shadow-lg" : "bg-white/20 text-white backdrop-blur-md border border-white/20"}`}
                      >
                        Map
                      </button>
                   </div>

                   <div className="absolute bottom-12 left-12 right-12">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-4 py-2 rounded-full bg-red-600 text-white text-[8px] font-black uppercase tracking-widest shadow-lg animate-pulse">Live Selection</span>
                        <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest border border-white/30">{selectedDest.region}</span>
                      </div>
                      <h2 className="text-6xl font-black text-white uppercase tracking-tighter mb-4">{selectedDest.name}</h2>
                      <div className="flex items-center gap-4 text-white/80">
                         <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                           <FiMapPin className="text-blue-400" /> {selectedDest.distanceKm} KM From Capital
                         </div>
                         <div className="h-4 w-[1px] bg-white/30" />
                         <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                           <FiActivity className="text-emerald-400" /> {selectedDest.avgTempDry}
                         </div>
                      </div>
                   </div>
                   <button 
                     onClick={() => {
                        setSelectedDest(null);
                        setViewMode("photo");
                     }}
                     className="absolute top-8 right-8 z-50 p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition backdrop-blur-xl border border-white/20"
                   >
                     <FiX size={20} />
                   </button>
                </div>

                {/* Right: Rich Details & Plan */}
                <div className="p-10 lg:p-20 bg-slate-50 dark:bg-slate-950 flex flex-col justify-between space-y-12">
                   <div className="space-y-8">
                      <div className="space-y-4">
                         <h4 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em]">Official Description</h4>
                         <p className="text-2xl text-[#051128] dark:text-white/80 font-black leading-tight tracking-tight italic">
                           "{selectedDest.description}"
                         </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Travel Advisory</p>
                            <p className="text-sm font-black text-[#051128] dark:text-white">{selectedDest.bestMonths}</p>
                         </div>
                         <div className="p-6 rounded-3xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10">
                            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Concierge Rate</p>
                            <p className="text-sm font-black text-[#051128] dark:text-white">{selectedDest.price}</p>
                         </div>
                      </div>
                   </div>

                   <div className="pt-12 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-8">
                      <div>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Next Available Slot</p>
                         <p className="text-lg font-black text-[#051128] dark:text-white">Tomorrow, 08:00 AM</p>
                      </div>
                       <button 
                        onClick={() => {
                          if (!user) {
                            router.push(`/login?next=${encodeURIComponent(`/add-trip?destination=${selectedDest.name}`)}`);
                            return;
                          }
                          router.push(`/add-trip?destination=${encodeURIComponent(selectedDest.name)}`);
                        }}
                        className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-blue-600/20 hover:scale-105 transition-all flex items-center justify-center gap-3"
                      >
                        Plan Your Journey <FiArrowRight />
                      </button>
                   </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search Interface */}
        <div className="mb-16">
          <div className="relative max-w-3xl group">
            <FiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 transition-colors" size={24} />
            <input
              type="search"
              placeholder="Search by destination name, region, or landmark..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white dark:bg-white/[0.03] py-6 pl-16 pr-8 text-[#051128] dark:text-white text-lg font-bold placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-blue-600/5 focus:border-blue-600/30 transition-all shadow-xl shadow-blue-900/5"
            />
          </div>
        </div>

        {/* Destination Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredDestinations.map((dest, i) => (
            <motion.div
                key={dest.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  setSelectedDest(dest);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`group relative cursor-pointer overflow-hidden rounded-[3rem] border transition-all hover:shadow-2xl hover:shadow-blue-900/10 ${
                  selectedDest?.name === dest.name 
                  ? "border-blue-600 bg-blue-50 dark:bg-blue-900/10 ring-4 ring-blue-600/10" 
                  : "border-slate-100 dark:border-white/5 bg-white dark:bg-[#0d0d1a]"
                } p-3`}
            >
              <div className="relative h-64 overflow-hidden rounded-[1.8rem]">
                <Image
                  src={dest.image || dest.imageUrl}
                  alt={dest.name}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 dark:from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-1">{dest.region}</p>
                   <p className="text-2xl font-black text-[#051128] dark:text-white uppercase tracking-tighter">{dest.name}</p>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <FiMapPin className="text-blue-600" /> {dest.distanceKm} KM
                </div>
                <span className="text-sm font-black text-blue-600">{dest.price}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="py-32 text-center">
             <FiSearch className="mx-auto text-6xl text-slate-100 dark:text-white/5 mb-6" />
             <p className="text-2xl font-black text-slate-300 dark:text-white/20 uppercase tracking-widest">No destinations found</p>
             <button onClick={() => setQuery("")} className="mt-6 text-blue-600 dark:text-blue-400 font-black uppercase tracking-widest text-xs hover:underline transition-all">Clear all filters</button>
          </div>
        )}

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
      <div className="min-h-screen bg-white dark:bg-[var(--bg)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent shadow-lg shadow-blue-600/20"></div>
      </div>
    }>
      <TripsContent />
    </Suspense>
  );
}
