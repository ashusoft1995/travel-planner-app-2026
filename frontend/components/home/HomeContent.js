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
  LineChart,
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
  {
    quote: "The Omo Valley experience was transformational. The guide's knowledge and the seamless logistics made it a once-in-a-lifetime trip.",
    name: "Elena S.",
    role: "Anthropologist · Italy",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote: "Business trips to Addis are usually stressful, but the Entoto views and local coffee tour recommendations turned my weekend into a vacation.",
    name: "Ahmed K.",
    role: "Tech Executive · UAE",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote: "Bale Mountains is a hidden gem. Seeing the Ethiopian Wolf in the wild was incredible. The planning tool helped us choose the right gear.",
    name: "Sarah W.",
    role: "Nature Lover · Canada",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote: "Harar is like nowhere else on Earth. The Hyatt feeding tradition is wild but safe with the local guides. Truly an ancient atmosphere.",
    name: "Kenji T.",
    role: "World Explorer · Japan",
    photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

const PROMOTIONS = [
  {
    id: 1,
    title: "Gondar Royal Flash",
    discount: "20% OFF",
    desc: "Explore the Camelot of Africa. Limited slots for Timket season bookings.",
    tag: "Hot Deal",
    color: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  },
  {
    id: 2,
    title: "Bale Alpine Escape",
    discount: "Perfect Weather",
    desc: "Peak visibility at Harenna Forest. Book your trekking guide today.",
    tag: "Good Weather",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  {
    id: 3,
    title: "Lalibela Pilgrimage",
    discount: "Package Deal",
    desc: "Full flight + hotel + guide bundles for the rock-hewn church circuit.",
    tag: "Trending",
    color: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  },
];

export default function HomeContent() {
  const [counters, setCounters] = useState({ travelers: 0, destinations: 0, hotels: 0 });
  const [demoCounters, setDemoCounters] = useState({ visitors: 0, spendETB: 0 });
  const [searchQ, setSearchQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [showAllDestinations, setShowAllDestinations] = useState(false);
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
        // Fallback to library data if API fails or returns less than 25
        const finalData = data.length >= 25 ? data : DESTINATION_DETAILS;
        setDestinations(finalData);
        setCounters(prev => ({ ...prev, destinations: finalData.length }));
      })
      .catch(e => {
        console.error(e);
        setDestinations(DESTINATION_DETAILS);
        setCounters(prev => ({ ...prev, destinations: DESTINATION_DETAILS.length }));
      });
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

  const displayedDestinations = destinations.slice(0, 25);

  return (
    <main className="page-shell bg-white dark:bg-[var(--bg)]">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden bg-brand-950">
        <div className="absolute inset-0">
          <Image src={HERO_IMAGE} alt="Hero" fill priority className="object-cover opacity-30" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-950/90 to-transparent" />
        </div>
        <div className="container relative z-10 flex min-h-[90vh] flex-col justify-center gap-12 py-24">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-4 py-2 mb-8">
              <span className="h-2 w-2 rounded-full bg-accent-yellow animate-pulse" />
              <span className="text-xs font-black uppercase tracking-widest text-white/60">New Exploration Phase Enabled</span>
            </motion.div>
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="text-6xl font-black text-white lg:text-8xl leading-[0.9] tracking-tighter uppercase">
              Ethiopia <span className="text-accent-yellow">Awaits</span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-8 text-xl text-white/50 max-w-xl font-medium">
              Discover 25+ iconic destinations across the roof of Africa. From rock-hewn ancient cities to lush tropical forests.
            </motion.p>
            <div className="mt-12 flex flex-col sm:flex-row gap-4 max-w-2xl">
              <div className="relative flex-1 group">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-accent-yellow transition-colors" size={20} />
                <input 
                  type="text" 
                  value={searchQ} 
                  onChange={e => setSearchQ(e.target.value)} 
                  className="w-full rounded-2xl bg-white/10 border border-white/20 p-4 pl-12 text-white outline-none focus:border-accent-yellow/50 backdrop-blur-md transition-all uppercase tracking-widest text-xs font-bold" 
                  placeholder="Where do you want to go?"
                />
              </div>
              <button onClick={runSearch} className="rounded-2xl bg-accent-yellow px-8 py-4 font-black uppercase tracking-widest text-black shadow-xl shadow-accent-yellow/20 hover:scale-105 active:scale-95 transition-all">Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="container py-12 -mt-16 relative z-20">
        <div className="grid md:grid-cols-3 gap-6">
          {PROMOTIONS.map((promo, idx) => (
            <motion.div
              key={promo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-[2rem] border ${promo.color} backdrop-blur-2xl shadow-2xl relative overflow-hidden group`}
            >
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/5 blur-2xl group-hover:scale-150 transition-transform" />
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/10 mb-4">{promo.tag}</span>
              <h4 className="text-xl font-black text-white mb-2 uppercase">{promo.title}</h4>
              <p className="text-4xl font-black text-accent-yellow mb-4">{promo.discount}</p>
              <p className="text-xs text-white/60 leading-relaxed">{promo.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="container py-24" ref={statsRef}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           {[
             { label: "Travelers Served", val: counters.travelers, suffix: "+", color: "text-purple-400" },
             { label: "Active Destinations", val: counters.destinations, suffix: "", color: "text-emerald-400" },
             { label: "Premium Lodging", val: counters.hotels, suffix: "", color: "text-blue-400" }
           ].map((stat, i) => (
             <div key={i} className="text-center group">
               <motion.p className={`text-7xl font-black tracking-tighter ${stat.color} text-glow-lg transition-transform group-hover:scale-110`}>
                 {stat.val.toLocaleString()}{stat.suffix}
               </motion.p>
               <p className="mt-4 text-xs font-black text-white/30 uppercase tracking-[0.3em]">{stat.label}</p>
             </div>
           ))}
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="container py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <h2 className="text-xs font-black text-accent-yellow uppercase tracking-[0.4em] mb-4">Discovery Archive</h2>
            <h3 className="text-5xl font-black text-white uppercase tracking-tight">Iconic <span className="text-white/40">Locations</span></h3>
          </div>
          <button 
            onClick={() => router.push("/trips")}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition-colors group"
          >
            View All 25+ Destinations <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedDestinations.map((dest, idx) => (
            <motion.div
              key={dest.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (idx % 8) * 0.05 }}
              className="group relative h-[450px] overflow-hidden rounded-[3rem] bg-white border border-slate-100 shadow-lg shadow-blue-900/5"
            >
              <Image 
                src={dest.image} 
                alt={dest.name} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" 
                sizes="(max-width: 768px) 100vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent opacity-90 group-hover:from-blue-600/90 group-hover:via-blue-600/40 transition-all duration-500" />
              
              {/* Hot Indicator */}
              {(dest.name === "Lalibela" || dest.name === "Gondar" || dest.name === "Simien Mountains" || dest.name === "Dallol") && (
                <div className="absolute top-6 right-6 z-20">
                  <div className="relative">
                    <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20" />
                    <div className="bg-red-600 text-[8px] font-black text-white px-3 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-red-900/20 flex items-center gap-1.5 border border-red-500/50">
                      <div className="h-1 w-1 bg-white rounded-full animate-pulse" />
                      Hot
                    </div>
                  </div>
                </div>
              )}

              {/* Click Hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 text-[10px] font-black uppercase tracking-widest text-white animate-bounce">
                  Explore Now
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-8 transform group-hover:-translate-y-4 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-1 w-8 bg-blue-600 group-hover:bg-white rounded-full transition-colors" />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-white/70 uppercase tracking-widest">{dest.region}</span>
                </div>
                <h4 className="text-3xl font-black text-[#051128] group-hover:text-white mb-2 uppercase tracking-tighter">{dest.name}</h4>
                <div className="flex items-center justify-between mt-4">
                  <p className="text-xl font-black text-blue-600 group-hover:text-white">{dest.price}</p>
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 backdrop-blur-md border border-slate-100 dark:border-white/20 shadow-sm">
                    <FiStar className="fill-blue-600 group-hover:fill-white text-blue-600 group-hover:text-white" size={12} />
                    <span className="text-[10px] font-black text-[#051128] dark:text-white">{dest.rating}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => router.push(`/trips?destination=${encodeURIComponent(dest.name)}`)}
                className="absolute inset-0 z-10 cursor-pointer"
                aria-label={`View ${dest.name}`}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Market Analytics Section */}
      <section className="container py-24 bg-white border border-slate-100 rounded-[4rem] my-24 overflow-hidden relative shadow-xl shadow-blue-900/5" ref={demoStatsRef}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-16">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Telemetry Integration</h2>
            <h3 className="text-5xl font-black text-[#051128] uppercase tracking-tight">Market <span className="text-slate-200">Analytics</span></h3>
            <p className="mt-6 text-slate-500 text-sm font-medium leading-relaxed">
              Synthesizing real-time traveler flow and economic indicators. We leverage deep telemetry to optimize your itinerary and budget allocation.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 h-[500px]">
            {/* Bar Chart: Volume */}
            <div className="p-8 rounded-[3rem] bg-[#f8faff] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8 px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Travel Volume Index</h4>
                <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={destinations.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000008" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', fontSize: '10px', color: '#051128', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#051128' }}
                      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    />
                    <Bar dataKey="travelVolumeIndex" fill="#2563eb" radius={[12, 12, 0, 0]} barSize={45} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Line Chart: Trends */}
            <div className="p-8 rounded-[3rem] bg-[#f8faff] dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between mb-8 px-2">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Rating Propagation</h4>
                <div className="h-2 w-2 rounded-full bg-purple-600 animate-pulse" />
              </div>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={destinations.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000008" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 10, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 10 }} domain={[4, 5]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '16px', fontSize: '10px', color: '#051128', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#051128' }}
                    />
                    <Line type="monotone" dataKey="rating" stroke="#a855f7" strokeWidth={4} dot={{ r: 6, fill: '#a855f7', strokeWidth: 0 }} activeDot={{ r: 8, strokeWidth: 0 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container py-24">
        <div className="text-center mb-20">
          <h2 className="text-xs font-black text-blue-600 uppercase tracking-[0.4em] mb-4">Transmission Logs</h2>
          <h3 className="text-5xl font-black text-[#051128] dark:text-white uppercase tracking-tight">Traveler <span className="text-slate-200 dark:text-white/20">Verified</span></h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="p-10 rounded-[3rem] bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 relative overflow-hidden group shadow-lg shadow-blue-900/5"
            >
              <div className="absolute top-8 right-10 text-slate-100 group-hover:text-blue-50 transition-colors">
                <svg width="40" height="30" viewBox="0 0 60 45" fill="currentColor">
                  <path d="M14.4 0C22.4 0 28.8 6.4 28.8 14.4C28.8 22.4 22.4 28.8 14.4 28.8H7.2V36H14.4V45H0V28.8C0 12.9 12.9 0 28.8 0H14.4ZM45.6 0C53.6 0 60 6.4 60 14.4C60 22.4 53.6 28.8 45.6 28.8H38.4V36H45.6V45H31.2V28.8C31.2 12.9 44.1 0 60 0H45.6Z" />
                </svg>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-10 relative z-10 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-slate-100 group-hover:ring-blue-600 transition-all">
                  <Image src={t.photo} alt={t.name} fill className="object-cover" />
                </div>
                <div>
                  <h5 className="font-black text-[#051128] text-sm uppercase tracking-widest">{t.name}</h5>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-24 mb-24">
        <div className="relative overflow-hidden rounded-[4rem] bg-[#f8faff] p-16 lg:p-32 text-center border border-slate-100 shadow-xl shadow-blue-900/5">
          <div className="absolute inset-0 opacity-5 grayscale pointer-events-none">
            <Image src={HERO_IMAGE} alt="CTA BG" fill className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-white/80 to-transparent" />
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl lg:text-7xl font-black text-[#051128] mb-8 tracking-tighter uppercase leading-[0.9]">Start your <span className="text-blue-600">Journey</span></h2>
            <p className="text-slate-500 text-xl mb-12 font-medium max-w-2xl mx-auto">
              Join thousands of travelers who have already discovered the hidden treasures of Ethiopia. Your bespoke experience starts with a single click.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={e => handleProtectedAction(e, "/add-trip")} 
                className="w-full sm:w-auto px-12 py-6 bg-blue-600 text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all"
              >
                Plan Your Trip
              </button>
              <Link 
                href="/contact" 
                className="w-full sm:w-auto px-12 py-6 bg-white text-[#051128] font-black uppercase tracking-widest rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all"
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
