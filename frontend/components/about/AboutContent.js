"use client";

import { motion } from "framer-motion";
import { 
  FiHeart, FiShield, FiDroplet, FiStar 
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

function SustainabilityCard({ icon, title, desc, bg, whiteIcon }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`p-10 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-white/10 transition-all ${bg}`}
    >
      <div className={`mb-8 text-3xl ${whiteIcon ? "text-white" : ""}`}>
        {icon}
      </div>
      <h4 className="text-xl font-black mb-4 tracking-tight uppercase">{title}</h4>
      <p className={`text-sm leading-relaxed ${bg.includes('white') ? 'text-slate-500 dark:text-slate-400' : 'opacity-70 font-medium'}`}>
        {desc}
      </p>
    </motion.div>
  );
}

export default function AboutContent() {
  return (
    <main className="bg-white dark:bg-[#050b18] text-slate-900 dark:text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden bg-[#051128]">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-black/40" />
        
        <div className="container relative h-full flex flex-col justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-4">
              Our Legacy
            </p>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase">
              The Heart of <br />
              <span className="text-blue-400">EthioTravel</span>
            </h1>
            <p className="mt-8 text-xl text-white/80 font-medium max-w-xl leading-relaxed">
              Founded by Ashu, Jemile, Elsa, Elsa, and a team of passionate cultural architects, we bridge the gap between world-class luxury and ancient heritage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Expertise Section (Replacing Team Photos) */}
      <section className="py-32 bg-white dark:bg-[#050b18]">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Core Competencies</h2>
            <h3 className="text-5xl font-black text-[#051128] dark:text-white uppercase tracking-tighter">Our <span className="text-blue-600">Expertise</span></h3>
            <p className="mt-6 text-slate-500 dark:text-slate-400 max-w-2xl mx-auto font-medium">
              We don't just plan trips; we architect experiences through a specialized set of heritage-focused skills.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Cultural Architecture", skill: "Heritage Deep-Dive", desc: "Expert curation of historical narratives and exclusive access to sacred sites." },
              { title: "Logistics Mastery", skill: "Remote Operations", desc: "Seamless movement across Ethiopia's most challenging and beautiful terrains." },
              { title: "Luxury Concierge", skill: "Bespoke Service", desc: "Tailoring every detail to the highest global standards of hospitality." },
              { title: "Heritage Guard", skill: "Sustainability", desc: "Ensuring 80% of travel spend directly benefits local community preservation." },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group p-10 rounded-[3rem] bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 hover:bg-blue-600 hover:border-blue-500 transition-all duration-500"
              >
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600 group-hover:text-white/70 mb-4">{item.skill}</p>
                <h4 className="text-2xl font-black text-[#051128] dark:text-white group-hover:text-white uppercase tracking-tighter mb-4">{item.title}</h4>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 group-hover:text-white/80 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainable Section */}
      <section className="py-24 bg-slate-50 dark:bg-white/5">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SustainabilityCard 
              icon={<FiHeart className="text-blue-500" />}
              title="Eco-Heritage"
              desc="We preserve the wonders we explore through active reforestation."
              bg="bg-white dark:bg-slate-900"
            />
            <SustainabilityCard 
              icon={<FiShield className="text-white" />}
              title="Pure Safety"
              desc="80% of our budget stays within local communities for security and wealth."
              bg="bg-[#051128] text-white"
              whiteIcon
            />
            <SustainabilityCard 
              icon={<FiDroplet className="text-blue-500" />}
              title="Water Access"
              desc="Providing solar desalination across the Danakil region."
              bg="bg-blue-600 text-white"
              whiteIcon
            />
            <SustainabilityCard 
              icon={<FiStar className="text-blue-500" />}
              title="Excellence"
              desc="Exclusively vetted cultural experiences without compromises."
              bg="bg-white dark:bg-slate-900"
            />
          </div>
        </div>
      </section>

      {/* Heritage Detail */}
      <section className="py-24 lg:py-40 dark:bg-[#050b18]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-10">
              <h2 className="text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none uppercase">THE <br /> ABYSSINIAN <br /> LEGACY</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                EthioTravel emerged from a passion to showcase the unparalleled majesty of the Horn of Africa. We believe that luxury is about exclusive access to stories untold and paths untraveled.
              </p>
              <div className="flex gap-12 pt-8 border-t border-slate-100 dark:border-white/10">
                <div>
                  <p className="text-4xl font-black text-blue-600">12+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Years Active</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-blue-600">500+</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">Expeditions</p>
                </div>
              </div>
            </div>
            <motion.div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-3xl border-[12px] border-white dark:border-white/5">
              <Image 
                src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200" 
                alt="Heritage"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100 dark:border-white/5">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-lg font-black text-slate-900 dark:text-white uppercase">EthioTravel</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-400">
             <Link href="/privacy" className="hover:text-blue-600 transition">Privacy</Link>
             <Link href="/terms" className="hover:text-blue-600 transition">Terms</Link>
             <Link href="/contact" className="hover:text-blue-600 transition">Support</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
