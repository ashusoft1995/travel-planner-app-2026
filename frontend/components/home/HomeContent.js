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

      <section className="container py-16" ref={statsRef}>
        <div className="grid grid-cols-3 gap-8">
           <div className="text-center">
             <p className="text-4xl font-bold text-brand-600 dark:text-accent-yellow">{counters.travelers.toLocaleString()}+</p>
             <p className="text-sm text-slate-500">Travelers</p>
           </div>
           <div className="text-center">
             <p className="text-4xl font-bold text-brand-600 dark:text-accent-yellow">{counters.destinations}</p>
             <p className="text-sm text-slate-500">Destinations</p>
           </div>
           <div className="text-center">
             <p className="text-4xl font-bold text-brand-600 dark:text-accent-yellow">{counters.hotels}</p>
             <p className="text-sm text-slate-500">Hotels</p>
           </div>
        </div>
      </section>
    </main>
  );
}
