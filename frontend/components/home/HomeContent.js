"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FiSearch, FiMapPin, FiStar, FiCalendar, FiUsers, FiHome, 
  FiTrendingUp, FiDollarSign, FiSun, FiMoon, FiArrowRight, 
  FiGlobe, FiThermometer
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "next-themes";
import { useInView } from "react-intersection-observer";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getDemoEconomics,
  getDestinationByName,
  DESTINATION_DETAILS
} from "../../lib/destinations";
import { fetchAnnouncements, getApiUrl } from "../../lib/api";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80";

const TESTIMONIALS = [
  {
    quote: "We almost skipped Gondar because of timing worries. EthioTravel’s dry-season temps and rainfall notes let us book the castle circuit with confidence.",
    name: "Priya N.",
    role: "Heritage traveler · UK",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote: "I’m a photographer on a tight budget. The dashboard let us split Simien add-on costs from Gondar and see what mattered before we committed.",
    name: "Marcus J.",
    role: "Photographer · Germany",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

export default function HomeContent() {
  const [counters, setCounters] = useState({ travelers: 0, destinations: 0, hotels: 0 });
  const [demoCounters, setDemoCounters] = useState({ visitors: 0, spendETB: 0 });
  const [searchQ, setSearchQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true });
  const { ref: demoStatsRef, inView: demoStatsInView } = useInView({ triggerOnce: true });

  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    fetchAnnouncements().then(res => setAnnouncements(res.data?.data || [])).catch(console.error);
    fetch(getApiUrl("/destinations"))
      .then(res => res.json())
      .then(res => {
        const data = res.data || [];
        setDestinations(data);
        setCounters(prev => ({ ...prev, destinations: data.length }));
      })
      .catch(console.error);
  }, []);

  const suggestions = useMemo(() => {
    if (searchQ.trim().length < 2) return [];
    return destinations
      .filter(d => 
        d.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
        d.country?.toLowerCase().includes(searchQ.toLowerCase()) ||
        d.region?.toLowerCase().includes(searchQ.toLowerCase())
      )
      .slice(0, 6);
  }, [searchQ, destinations]);

  const demoTotals = useMemo(() => {
    let visitors = 0;
    let spendSum = 0;
    for (const d of destinations) {
      const e = getDemoEconomics(d);
      visitors += e.monthlyVisitors;
      spendSum += e.avgSpendETB;
    }
    const n = destinations.length || 1;
    return { visitors, avgSpendETB: Math.round(spendSum / n) };
  }, [destinations]);

  useEffect(() => {
    if (!statsInView) return;
    const animate = (target, key) => {
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const id = setInterval(() => {
        current += step;
        if (current >= target) {
          setCounters((p) => ({ ...p, [key]: target }));
          clearInterval(id);
        } else {
          setCounters((p) => ({ ...p, [key]: current }));
        }
      }, 18);
    };
    animate(25800, "travelers");
    animate(150 + destinations.length * 2, "destinations");
    animate(1240, "hotels");
  }, [statsInView, destinations.length]);

  useEffect(() => {
    if (!demoStatsInView) return;
    const animate = (target, key) => {
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 45));
      const id = setInterval(() => {
        current += step;
        if (current >= target) {
          setDemoCounters((p) => ({ ...p, [key]: target }));
          clearInterval(id);
        } else {
          setDemoCounters((p) => ({ ...p, [key]: current }));
        }
      }, 18);
    };
    animate(demoTotals.visitors, "visitors");
    animate(demoTotals.avgSpendETB, "spendETB");
  }, [demoStatsInView, demoTotals]);

  const scrollToResult = () => {
    setTimeout(() => {
      const el = document.getElementById("search-result");
      if (el) {
        const yOffset = -80;
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 150);
  };

  const runSearch = () => {
    const q = searchQ.trim();
    if (!q) { setSelected(null); return; }
    const exact = destinations.find(d => d.name?.toLowerCase().includes(q.toLowerCase()));
    if (exact) { setSelected(exact); setSearchQ(""); scrollToResult(); }
    else {
      const list = destinations.filter(d => d.name?.toLowerCase().includes(q.toLowerCase()));
      if (list.length > 0) { setSelected(list[0]); setSearchQ(""); scrollToResult(); }
      else setSelected(null);
    }
  };

  const handleProtectedAction = (e, dest) => {
    e.preventDefault();
    if (user) router.push(dest);
    else router.push(`/login?next=${encodeURIComponent(dest)}`);
  };

  return (
    <main className="page-shell">
      <section className="relative min-h-[88vh] overflow-hidden bg-brand-950">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE} alt="Hero" fill priority className="object-cover opacity-40" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-950/90 to-brand-900/20" />
        </div>
        <div className="container relative z-10 grid min-h-[88vh] items-center gap-12 py-24 lg:grid-cols-2">
          <div>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-5xl font-bold text-white lg:text-6xl">
              Your next adventure starts here
            </motion.h1>
            <div className="mt-8 flex gap-2 max-w-md">
              <input 
                type="text" 
                value={searchQ} 
                onChange={e => setSearchQ(e.target.value)} 
                className="flex-1 rounded-xl bg-white/10 border border-white/20 p-3 text-white" 
                placeholder="Search destination..."
              />
              <button onClick={runSearch} className="rounded-xl bg-accent-yellow px-6 py-3 font-bold text-black">Go</button>
            </div>
            <div className="mt-8 flex gap-4">
               <button onClick={e => handleProtectedAction(e, "/add-trip")} className="rounded-xl bg-brand-500 px-8 py-3 font-bold text-white">Start Planning</button>
               <Link href="/trips" className="rounded-xl border border-white/30 px-8 py-3 text-white">Browse Trips</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Destination Result */}
      <AnimatePresence>
        {selected && (
          <motion.section 
            id="search-result"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="container py-12"
          >
            <div className="rounded-3xl bg-white/5 border border-white/10 p-8">
               <h2 className="text-3xl font-bold text-white">{selected.name}</h2>
               <p className="mt-4 text-slate-300 max-w-2xl">{selected.description}</p>
               <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400">Temp</p>
                    <p className="text-xl font-bold text-white">{selected.avgTempDry}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-xs text-slate-400">Best Time</p>
                    <p className="text-xl font-bold text-white">{selected.bestMonths}</p>
                  </div>
               </div>
               <button onClick={() => setSelected(null)} className="mt-8 text-sm text-slate-500">Dismiss</button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Stats Section */}
      <section className="container py-16" ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
           >
             <p className="text-5xl font-extrabold text-brand-600 dark:text-accent-yellow">{counters.travelers.toLocaleString()}+</p>
             <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-widest">Travelers Served</p>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-center p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
           >
             <p className="text-5xl font-extrabold text-brand-600 dark:text-accent-yellow">{counters.destinations}</p>
             <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-widest">Global Destinations</p>
           </motion.div>
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="text-center p-8 rounded-3xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10"
           >
             <p className="text-5xl font-extrabold text-brand-600 dark:text-accent-yellow">{counters.hotels}</p>
             <p className="mt-2 text-sm font-medium text-slate-500 uppercase tracking-widest">Premium Hotels</p>
           </motion.div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-2">Explore</h2>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white">Featured Destinations</h3>
          </div>
          <Link href="/trips" className="flex items-center gap-2 text-brand-600 dark:text-accent-yellow font-bold group">
            View all destinations <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DESTINATION_DETAILS.slice(0, 4).map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative h-[400px] overflow-hidden rounded-3xl bg-slate-100"
            >
              <Image 
                src={dest.image} 
                alt={dest.name} 
                fill 
                className="object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <FiMapPin className="text-accent-yellow" />
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider">{dest.region}</span>
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">{dest.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-accent-yellow font-bold">{dest.price}</p>
                  <div className="flex items-center gap-1">
                    <FiStar className="fill-accent-yellow text-accent-yellow" />
                    <span className="text-sm font-bold text-white">{dest.rating}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setSelected(dest); scrollToResult(); }}
                className="absolute inset-0 z-10 opacity-0"
                aria-label={`View ${dest.name}`}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Market Analytics Graph */}
      <section className="container py-24 bg-slate-50 dark:bg-brand-950/30 rounded-[3rem] my-12" ref={demoStatsRef}>
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <h2 className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-2">Insights</h2>
            <h3 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Market Overview</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Experience data-driven travel planning. Our real-time analytics help you understand travel trends, peak seasons, and budget optimizations for each destination.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-100 dark:bg-brand-500/20 flex items-center justify-center text-brand-600 dark:text-brand-400">
                  <FiUsers size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{demoCounters.visitors.toLocaleString()}</p>
                  <p className="text-sm text-slate-500">Monthly Visitors</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-accent-yellow/10 flex items-center justify-center text-accent-yellow">
                  <FiDollarSign size={24} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{demoCounters.spendETB.toLocaleString()} ETB</p>
                  <p className="text-sm text-slate-500">Average Spend</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3 h-[400px] w-full bg-white dark:bg-white/5 rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-none">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={DESTINATION_DETAILS.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} opacity={0.3} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar yAxisId="left" dataKey="travelVolumeIndex" fill="#a855f7" radius={[6, 6, 0, 0]} barSize={40} name="Travel Volume" />
                <Line yAxisId="right" type="monotone" dataKey="rating" stroke="#d8b4fe" strokeWidth={3} dot={{ r: 6, fill: '#d8b4fe', strokeWidth: 0 }} name="Rating" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24">
        <div className="text-center mb-16">
          <h2 className="text-sm font-bold text-brand-500 uppercase tracking-widest mb-2">Testimonials</h2>
          <h3 className="text-4xl font-bold text-slate-900 dark:text-white">What Our Travelers Say</h3>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative p-10 rounded-[2.5rem] bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/30 dark:shadow-none"
            >
              <div className="absolute top-8 right-10 text-brand-100 dark:text-white/5">
                <svg width="60" height="45" viewBox="0 0 60 45" fill="currentColor">
                  <path d="M14.4 0C22.4 0 28.8 6.4 28.8 14.4C28.8 22.4 22.4 28.8 14.4 28.8H7.2V36H14.4V45H0V28.8C0 12.9 12.9 0 28.8 0H14.4ZM45.6 0C53.6 0 60 6.4 60 14.4C60 22.4 53.6 28.8 45.6 28.8H38.4V36H45.6V45H31.2V28.8C31.2 12.9 44.1 0 60 0H45.6Z" />
                </svg>
              </div>
              <p className="text-xl text-slate-700 dark:text-slate-300 italic mb-8 relative z-10">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-brand-500">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white">{t.name}</h5>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24">
        <div className="relative overflow-hidden rounded-[3.5rem] bg-brand-600 dark:bg-brand-900 p-12 lg:p-24 text-center">
          <div className="absolute inset-0 opacity-20">
            <Image src={HERO_IMAGE} alt="CTA BG" fill className="object-cover" />
          </div>
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">Ready to plan your next getaway?</h2>
            <p className="text-brand-100 text-lg mb-10">
              Join thousands of travelers who have discovered the wonders of Ethiopia through our personalized planning tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button 
                onClick={e => handleProtectedAction(e, "/add-trip")} 
                className="w-full sm:w-auto px-10 py-5 bg-accent-yellow text-black font-extrabold rounded-2xl hover:scale-105 transition-transform"
              >
                Create My Trip
              </button>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-10 py-5 bg-white/10 text-white font-bold rounded-2xl border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
