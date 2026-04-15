"use client";

import Image from "next/image";
import Link from "next/link";
import { FiSearch, FiMapPin, FiStar, FiCalendar, FiUsers, FiHome, FiTrendingUp, FiDollarSign, FiSun, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
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
  FiArrowRight,
  FiCalendar,
  FiGlobe,
  FiHome,
  FiMapPin,
  FiSearch,
  FiStar,
  FiThermometer,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import {
  getDemoEconomics,
  getDestinationByName,
} from "../lib/destinations";
import { fetchAnnouncements } from "../lib/api";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=80";

/** Public testimonials — stock portraits (Unsplash). No login required. */
const TESTIMONIALS = [
  {
    quote:
      "We almost skipped Gondar because of timing worries. EthioTravel’s dry-season temps and rainfall notes let us book the castle circuit with confidence — the map preview meant we knew exactly where to meet our guide. That one screen saved us a full day of back-and-forth messages.",
    name: "Priya N.",
    role: "Heritage traveler · UK",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "I’m a photographer on a tight budget. The dashboard let us split Simien add-on costs from Gondar and see what mattered before we committed. We stretched the trek by two days without blowing the trip — the planner felt like a calm co-pilot instead of a spreadsheet.",
    name: "Marcus J.",
    role: "Photographer · Germany",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "Traveling solo, I obsess over weather. The seasonal guidance here was blunt and useful — we dodged the worst rains and still caught Lalibela in good light for photography. I’d been anxious for weeks; seeing the climate note in one place actually got me excited to go.",
    name: "Elena R.",
    role: "Solo traveler · Spain",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "Our family of four used the destination cards to agree on Bale vs. Langano without a fight. The kids cared about photos and swimming; we cared about roads and cost. Seeing ratings, price bands, and best months side by side ended the group chat spiral — we booked the same week.",
    name: "David & Amara T.",
    role: "Family trip · Canada",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "I plan incentive trips for a small team. I needed something I could show leadership fast: where interest is high, what a rough spend looks like, and which highlights cluster on one circuit. The charts are labeled as demo data — honest — but they still help me pitch ‘why Ethiopia’ in one scroll.",
    name: "Sofia K.",
    role: "Corporate planner · UAE",
    photo:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&h=200&q=80",
  },
  {
    quote:
      "First time in East Africa — I was scared of getting lost in logistics. Starting from the search bar, picking a place, and seeing climate + map in one flow lowered my stress. I’m already using it to motivate friends: ‘Look, your whole first day is legible before you pay anything.’",
    name: "James O.",
    role: "First-time visitor · Nigeria",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&h=200&q=80",
  },
];

export default function HomePage() {
  const [counters, setCounters] = useState({
    travelers: 0,
    destinations: 0,
    hotels: 0,
  });
  const [demoCounters, setDemoCounters] = useState({ visitors: 0, spendETB: 0 });
  const [searchQ, setSearchQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true });
  const { ref: demoStatsRef, inView: demoStatsInView } = useInView({
    triggerOnce: true,
  });

  const { user, isAdmin } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    fetchAnnouncements().then(res => {
      setAnnouncements(res.data || []);
    }).catch(console.error);
    
    // Fetch destinations from API
    fetch("/api/destinations")
      .then(res => res.json())
      .then(data => {
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

  const chartData = useMemo(
    () =>
      [...destinations]
        .sort((a, b) => (b.travelVolumeIndex || 0) - (a.travelVolumeIndex || 0))
        .map((d) => ({
          name: d.name.length > 12 ? `${d.name.slice(0, 11)}…` : d.name,
          fullName: d.name,
          index: d.travelVolumeIndex || 0,
        })),
    [destinations]
  );

  const economicsChartData = useMemo(
    () =>
      [...destinations]
        .sort((a, b) => (b.travelVolumeIndex || 0) - (a.travelVolumeIndex || 0))
        .map((d) => {
          const e = getDemoEconomics(d);
          return {
            name: d.name.length > 10 ? `${d.name.slice(0, 9)}…` : d.name,
            fullName: d.name,
            visitors: e.monthlyVisitors,
            spendETB: e.avgSpendETB,
          };
        }),
    [destinations]
  );

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
  }, [statsInView]);

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
        const yOffset = -80; // offset for sticky nav
        const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 150);
  };

  const runSearch = () => {
    const q = searchQ.trim();
    if (!q) {
      setSelected(null);
      return;
    }
    
    // Search in fetched destinations
    const exact = destinations.find(d => 
      d.name?.toLowerCase() === q.toLowerCase() ||
      d.name?.toLowerCase().includes(q.toLowerCase())
    );
    
    if (exact) {
      setSelected(exact);
      setSearchQ("");
      scrollToResult();
      return;
    }
    
    const list = destinations.filter(d => 
      d.name?.toLowerCase().includes(q.toLowerCase()) ||
      d.country?.toLowerCase().includes(q.toLowerCase()) ||
      d.region?.toLowerCase().includes(q.toLowerCase())
    );
    
    if (list.length > 0) {
      setSelected(list[0]);
      setSearchQ("");
      scrollToResult();
    }
    else setSelected(null);
  };

  const handleProtectedAction = (e, dest) => {
    e.preventDefault();
    if (user) {
      router.push(dest);
    } else {
      router.push(`/login?next=${encodeURIComponent(dest)}`);
    }
  };

  const mapEmbedSrc = selected
    ? `https://www.google.com/maps?q=${selected.lat},${selected.lng}&z=8&output=embed`
    : null;

  return (
    <main className="page-shell">
      <section className="relative min-h-[88vh] overflow-hidden bg-brand-950">
        {/* Background image */}
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={HERO_IMAGE}
            alt="Ethiopian highlands"
            fill
            priority
            className="object-cover opacity-40"
            sizes="100vw"
          />
          {/* Multi-layer gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-950/90 to-brand-900/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
        </div>

        {/* Animated background orbs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -40, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-brand-500/10 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 3 }}
            className="absolute -right-32 bottom-0 h-[600px] w-[600px] rounded-full bg-accent-yellow/5 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, 15, 0], y: [0, -20, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-[20%] top-[20%] h-64 w-64 rounded-full bg-purple-500/10 blur-3xl"
          />
        </div>

        <div className="container relative z-10 grid min-h-[88vh] items-center gap-12 py-24 lg:grid-cols-2">
          {/* ── Left: Text content ── */}
          <div className="max-w-xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent-yellow/30 bg-accent-yellow/10 px-4 py-1.5 text-xs font-bold tracking-widest text-accent-yellow uppercase">
                🌍 World-Class Travel Planning
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="mt-6 text-5xl font-bold leading-tight text-white lg:text-6xl"
            >
              Your next
              <span className="relative mx-3 inline-block">
                <span className="relative z-10 bg-gradient-to-r from-accent-yellow via-orange-400 to-accent-yellow bg-clip-text text-transparent">
                  adventure
                </span>
                <motion.span
                  animate={{ scaleX: [1, 1.04, 1] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="absolute -bottom-1 left-0 h-1 w-full rounded-full bg-gradient-to-r from-accent-yellow to-orange-400"
                />
              </span>
              starts here
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mt-6 text-lg leading-relaxed text-slate-300"
            >
              Explore world-class destinations, get climate insights, and build complete
              itineraries — all in one place. No login needed to explore.
            </motion.p>

            {/* Search bar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8"
            >
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent-yellow/80">
                Search a destination
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && runSearch()}
                    placeholder="e.g. Lalibela, Gondar, Bale…"
                    className="w-full rounded-2xl border border-white/20 bg-white/10 py-3.5 pl-11 pr-4 text-white placeholder:text-slate-400 outline-none backdrop-blur focus:border-accent-yellow/60 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-400"
                    aria-label="Search destinations"
                  />
                  {suggestions.length > 0 && (
                    <ul className="absolute z-20 mt-2 max-h-56 w-full overflow-auto rounded-2xl border border-white/10 bg-brand-950/95 py-1 shadow-xl backdrop-blur">
                      {suggestions.map((s) => (
                        <li key={s.name}>
                          <button
                            type="button"
                            className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-slate-100 hover:bg-white/10"
                            onClick={() => { 
                              setSelected(s); 
                              setSearchQ(""); 
                              scrollToResult();
                            }}
                          >
                            <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              {s.imageUrl ? (
                                <img
                                  src={s.imageUrl}
                                  alt={s.name}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.parentElement.className = 'w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center';
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate">{s.name}</div>
                              <div className="text-xs text-slate-400 truncate">{s.region}, {s.country}</div>
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <button
                  type="button"
                  onClick={runSearch}
                  className="rounded-2xl bg-accent-yellow px-6 py-3 text-sm font-bold text-brand-950 transition hover:opacity-90"
                >
                  Go
                </button>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <button
                type="button"
                onClick={(e) => handleProtectedAction(e, "/add-trip")}
                className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-500 to-accent-green px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition hover:shadow-xl hover:shadow-brand-500/40"
              >
                Start planning <FiArrowRight className="transition group-hover:translate-x-1" />
              </button>
              <Link href="/trips">
                <span className="inline-flex items-center gap-2 rounded-2xl border-2 border-white/30 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:border-white/60 hover:bg-white/10 cursor-pointer">
                  Browse trips
                </span>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-10 flex flex-wrap items-center gap-6"
            >
              {[
                { icon: FiUsers, label: "25,800+ Travelers" },
                { icon: FiGlobe, label: "150+ Destinations" },
                { icon: FiStar, label: "4.9 / 5 Rating" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 text-sm text-white/60">
                  <b.icon size={14} className="text-accent-yellow" />
                  <span>{b.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Floating cards ── */}
          <div className="relative hidden h-[520px] lg:block">
            {/* Background glowing circle */}
            <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl" />

            {/* Main destination card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-6 top-8 w-64 overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-2xl backdrop-blur-xl"
              >
                <div className="relative h-36">
                  <Image
                    src="https://images.unsplash.com/photo-1489493887464-892be6d1daae?auto=format&fit=crop&w=400&q=80"
                    alt="Lalibela"
                    fill
                    className="object-cover"
                    sizes="256px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-sm font-bold text-white">Lalibela, Ethiopia</span>
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <FiStar key={i} size={11} className="fill-accent-yellow text-accent-yellow" />)}
                    <span className="ml-1 text-xs text-white/60">4.9 · 1.2k</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">✈ Available</span>
                    <span className="text-xs font-bold text-white">$890 / person</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Stats card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute right-4 top-20 w-52 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-yellow/20 text-accent-yellow">
                    <FiTrendingUp size={16} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-white">25,800+</p>
                    <p className="text-xs text-white/60">Active travelers this month</p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full rounded-full bg-gradient-to-r from-accent-yellow to-orange-400"
                  />
                </div>
              </motion.div>
            </motion.div>

            {/* Weather card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.7 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-24 left-10 w-48 rounded-2xl border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">☀️</div>
                  <div>
                    <p className="text-base font-bold text-white">24°C</p>
                    <p className="text-xs text-white/60">Gondar · Clear</p>
                  </div>
                </div>
                <p className="mt-2 text-[10px] text-white/50">Best time: Nov – Feb</p>
              </motion.div>
            </motion.div>

            {/* Budget badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.5 }}
            >
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute bottom-28 right-10 w-52 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 shadow-2xl backdrop-blur-xl"
              >
                <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">💰 Budget Saved</p>
                <p className="mt-1 text-xl font-bold text-white">$1,240</p>
                <p className="text-xs text-white/50">vs. traditional agency booking</p>
              </motion.div>
            </motion.div>

            {/* Floating ping dot */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute left-[48%] top-[42%] flex h-5 w-5 items-center justify-center"
            >
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-yellow/40 animate-ping" />
              <span className="relative flex h-3 w-3 rounded-full bg-accent-yellow" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Dynamic Search result - Full Width / Down Back */}
      <AnimatePresence>
        {selected && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            id="search-result"
            className="container py-12"
          >
            <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-white/5">
                 <div className="flex items-center gap-4">
                    <span className="rounded-full bg-accent-yellow/20 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-accent-yellow">
                      Intelligence Briefing
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400 font-bold text-sm tracking-tighter">
                       Value: {selected.price}
                    </span>
                 </div>
                 <button 
                  onClick={() => setSelected(null)}
                  className="text-[10px] font-black uppercase tracking-widest text-white/20 hover:text-white transition"
                 >
                   Clear Selection
                 </button>
              </div>

              <div className="grid lg:grid-cols-2">
                <div className="relative h-80 lg:h-auto min-h-[450px]">
                  <Image
                    src={selected.image}
                    alt={selected.name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-8 left-8">
                     <p className="text-xs font-black uppercase tracking-widest text-accent-yellow mb-2">{selected.region}</p>
                     <h2 className="text-4xl font-black text-white">{selected.name}</h2>
                  </div>
                </div>

                <div className="p-10 space-y-8">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-2">Summary</p>
                    <p className="text-lg text-slate-300 leading-relaxed font-medium">{selected.description}</p>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                       <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                          <FiThermometer className="text-accent-yellow" /> Temperature
                       </p>
                       <p className="text-xl font-black text-white">{selected.avgTempDry}</p>
                       <p className="mt-1 text-[10px] text-white/30 truncate">{selected.climateNote}</p>
                    </div>
                    <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                       <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                          <FiCalendar className="text-emerald-400" /> Best Months
                       </p>
                       <p className="text-xl font-black text-white">{selected.bestMonths}</p>
                       <p className="mt-1 text-[10px] text-white/30">Peak travel window</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-white/30">Rating</span>
                        <span className="flex items-center gap-1 text-xl font-black text-white"><FiStar className="text-accent-yellow fill-accent-yellow" /> {selected.rating}</span>
                     </div>
                     <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase text-white/30">Coordinates</span>
                        <span className="text-lg font-bold text-white tracking-tighter">{selected.lat.toFixed(2)}N, {selected.lng.toFixed(2)}E</span>
                     </div>
                     <button
                        onClick={(e) => handleProtectedAction(e, `/add-trip?dest=${selected.name}`)}
                        className="ml-auto rounded-2xl bg-white px-8 py-4 text-sm font-black text-brand-950 transition hover:bg-accent-yellow"
                     >
                        PLAN THIS TRIP
                     </button>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/5 bg-black/20">
                 <p className="text-[10px] font-black uppercase tracking-widest text-white/30 mb-6 flex items-center gap-2">
                    <FiMapPin /> Map Terminal 
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                 </p>
                 <div className="overflow-hidden rounded-[2rem] border border-white/10 shadow-inner">
                    <iframe
                      title="Geospatial Map"
                      src={`https://www.google.com/maps?q=${selected.lat},${selected.lng}&z=8&output=embed`}
                      className="h-[350px] w-full border-0 grayscale-[20%] contrast-[110%] opacity-80"
                      loading="lazy"
                    />
                 </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Breaking News / Announcements Section */}
      <AnimatePresence>
        {announcements.length > 0 && (
          <section className="bg-brand-950 border-y border-white/5 py-12">
            <div className="container">
              <header className="relative z-10 flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <Link href="/" className="text-2xl font-bold text-white">
                    Ethio<span className="text-accent-yellow">Travel</span>
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                    aria-label="Toggle theme"
                  >
                    {theme === 'dark' ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
                  </button>
                </div>
              </header>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white tracking-tight">Travel Intelligence & Alerts</h2>
                  <p className="text-sm text-white/40 italic">Real-time transmissions from EthioTravel HQ</p>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {announcements.map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition hover:border-accent-yellow/30"
                  >
                    {a.image && (
                      <div className="absolute inset-0 z-0">
                        <img src={a.image} alt="" className="h-full w-full object-cover opacity-20 transition duration-700 group-hover:scale-110 group-hover:opacity-30" />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/80 to-transparent" />
                      </div>
                    )}
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest ${
                          a.type === 'warning' ? 'bg-red-500/20 text-red-400' : 
                          a.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {a.type || 'Alert'}
                        </span>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="mb-3 text-xl font-bold text-white group-hover:text-accent-yellow transition-colors">{a.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-300 line-clamp-4">{a.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </AnimatePresence>

      <div className="container py-16">

        <section className="mb-16">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600 dark:text-accent-yellow">
                Destinations
              </p>
              <h2 className="mt-2 text-3xl font-bold text-[var(--text)]">Ethiopian highlights</h2>
            </div>
            <Link href="/trips" className="text-sm font-semibold text-brand-600 dark:text-accent-yellow">
              View all trips →
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {destinations.map((d, i) => (
              <motion.article
                key={d.name}
                initial={{ opacity: 1, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.08 }}
                transition={{ delay: i * 0.04 }}
                className="card-surface cursor-pointer overflow-hidden transition hover:-translate-y-0.5"
                role="button"
                tabIndex={0}
                onClick={() => {
                  setSearchQ(d.name);
                  setSelected(d);
                  scrollToResult();
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setSearchQ(d.name);
                    setSelected(d);
                    scrollToResult();
                  }
                }}
              >
                <div className="aspect-video overflow-hidden relative">
                  {d.imageUrl ? (
                    <img
                      src={d.imageUrl}
                      alt={d.name}
                      className="w-full h-full object-cover transition group-hover:scale-105"
                      onError={(e) => {
                        // Fallback to placeholder if image fails to load
                        e.target.style.display = 'none';
                        e.target.parentElement.querySelector('.fallback-image').style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="fallback-image w-full h-full flex items-center justify-center bg-gray-200 absolute inset-0" style={{display: d.imageUrl ? 'none' : 'flex'}}>
                    <FiMapPin className="h-12 w-12 text-gray-400" />
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-[var(--text)]">{d.name}</h3>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {d.region && `${d.region}, `}
                        {d.country}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-brand-600 dark:text-accent-yellow">
                      <FiStar className="h-4 w-4 fill-current" />
                      <span className="text-sm font-bold">
                        {Object.values(d.hotels || {}).length > 0 
                          ? (Object.values(d.hotels).reduce((sum, h) => sum + h.rating, 0) / Object.values(d.hotels).length).toFixed(1)
                          : "4.5"
                        }
                      </span>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[var(--muted)] line-clamp-2">
                    {d.description || "Discover the beauty and culture of this amazing destination."}
                  </p>
                  <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
                    <span className="flex items-center gap-1">
                      <FiHome className="h-4 w-4" />
                      {Object.keys(d.hotels || {}).length} hotels
                    </span>
                    <span className="flex items-center gap-1">
                      <FiMapPin className="h-4 w-4" />
                      {Object.keys(d.activities || {}).length} activities
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section className="mb-16 rounded-[2rem] border border-[var(--border)] bg-gradient-to-br from-brand-800/90 to-brand-950 p-10 text-white shadow-xl dark:from-brand-900 dark:to-brand-950">
          <h2 className="text-2xl font-bold">Travelers say it best</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-300">
            Real portraits from open stock (Unsplash). These sample stories highlight how clear
            destinations, climate notes, and planning tools reduce stress and help groups commit to the
            trip — written to feel like real trip reports, not taglines.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, idx) => (
              <blockquote
                key={`${t.name}-${idx}`}
                className="flex flex-col rounded-2xl bg-white/10 p-6 backdrop-blur"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover ring-2 ring-accent-yellow/50"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs text-slate-400">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-100">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </blockquote>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <button
               onClick={(e) => handleProtectedAction(e, "/dashboard")}
               className="inline-flex items-center gap-2 rounded-full bg-accent-yellow px-6 py-3 text-sm font-bold text-brand-950"
            >
                Open dashboard <FiCalendar />
            </button>
            <Link href="/contact">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white">
                Contact us
              </span>
            </Link>
          </div>
        </section>

        <section ref={statsRef} className="mb-16 grid gap-6 sm:grid-cols-3">
          {[
            { label: "Travelers", value: counters.travelers, icon: <FiUsers size={22} /> },
            { label: "Destinations", value: counters.destinations, icon: <FiGlobe size={22} /> },
            { label: "Hotels", value: counters.hotels, icon: <FiHome size={22} /> },
          ].map((item) => (
            <div key={item.label} className="card-surface p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600/15 text-brand-600 dark:text-accent-yellow">
                {item.icon}
              </div>
              <p className="mt-4 text-3xl font-bold text-[var(--text)]">
                {item.value.toLocaleString()}+
              </p>
              <p className="mt-1 text-sm text-[var(--muted)]">{item.label}</p>
            </div>
          ))}
        </section>

        <motion.section
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45 }}
          className="card-surface mb-16 p-8"
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-brand-600 dark:text-accent-yellow">
                <FiTrendingUp /> Travel demand
              </p>
              <h2 className="mt-2 text-2xl font-bold text-[var(--text)]">
                Highly traveled destinations (static index)
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
                Illustrative popularity index for the Ethiopian highlights on this site — useful for
                comparing where travelers often focus when planning circuits (not official statistics).
              </p>
            </div>
          </div>
          <div className="mt-8 h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ left: 8, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: "var(--muted)", fontSize: 11 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  width={108}
                  tick={{ fill: "var(--muted)", fontSize: 11 }}
                />
                <Tooltip
                  formatter={(value, _n, p) => [`${value}`, "Index"]}
                  labelFormatter={(_, p) => p?.[0]?.payload?.fullName ?? ""}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid var(--border)",
                    background: "var(--surface)",
                  }}
                />
                <Bar
                  dataKey="index"
                  name="Travel interest index"
                  fill="#1f5bb5"
                  radius={[0, 8, 8, 0]}
                  isAnimationActive
                  animationDuration={1100}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        <section ref={demoStatsRef} className="mb-16">
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.5 }}
            className="card-surface overflow-hidden p-8"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.28em] text-brand-600 dark:text-accent-yellow">
                  <FiUsers /> Demo economics (test data)
                </p>
                <h2 className="mt-2 text-2xl font-bold text-[var(--text)]">
                  People & average spend — illustrative stats
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
                  Synthetic monthly visitors and average trip spend in ETB, derived from each place’s
                  interest index — for layout and animation demos only, not real surveys.
                </p>
              </div>
              <div className="grid shrink-0 grid-cols-2 gap-4 sm:min-w-[280px]">
                <div className="rounded-2xl border border-[var(--border)] bg-brand-500/5 px-5 py-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Demo people / mo
                  </p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--text)]">
                    {demoCounters.visitors.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">sum across listed spots</p>
                </div>
                <div className="rounded-2xl border border-[var(--border)] bg-brand-500/5 px-5 py-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Avg spend (ETB)
                  </p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-[var(--text)]">
                    {demoCounters.spendETB.toLocaleString()}
                  </p>
                  <p className="mt-1 text-[11px] text-[var(--muted)]">mean per destination</p>
                </div>
              </div>
            </div>
            <div className="mt-8 h-[360px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={economicsChartData} margin={{ left: 4, right: 16, top: 8, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-[var(--border)]" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "var(--muted)", fontSize: 10 }}
                    interval={0}
                    angle={-28}
                    textAnchor="end"
                    height={72}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fill: "var(--muted)", fontSize: 11 }}
                    label={{ value: "Visitors / mo", angle: -90, position: "insideLeft", fill: "var(--muted)", fontSize: 11 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "var(--muted)", fontSize: 11 }}
                    label={{ value: "ETB", angle: 90, position: "insideRight", fill: "var(--muted)", fontSize: 11 }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      name === "visitors" ? value.toLocaleString() : `${value.toLocaleString()} ETB`,
                      name === "visitors" ? "Monthly visitors (demo)" : "Avg trip spend (demo)",
                    ]}
                    labelFormatter={(_, p) => p?.[0]?.payload?.fullName ?? ""}
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid var(--border)",
                      background: "var(--surface)",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar
                    yAxisId="left"
                    dataKey="visitors"
                    name="Monthly visitors (demo)"
                    fill="#1f5bb5"
                    radius={[6, 6, 0, 0]}
                    isAnimationActive
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="spendETB"
                    name="Avg spend ETB (demo)"
                    stroke="#c9a227"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#c9a227" }}
                    isAnimationActive
                    animationDuration={1400}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </section>
      </div>
    </main>
  );
}
