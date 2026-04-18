"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiCompass, FiCamera, FiMusic, FiCoffee, FiSun, FiMoon } from "react-icons/fi";

const EXPERIENCES = [
  {
    title: "The Coffee Ceremony",
    desc: "Immerse yourself in the birthplace of Arabica. Witness the rhythmic ritual of roasting, grinding, and brewing in a traditional Ethiopian home.",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    icon: <FiCoffee />,
    tag: "Cultural"
  },
  {
    title: "Dallol Volcanic Trek",
    desc: "Explore the neon-colored hydrothermal fields of the Danakil Depression, the hottest inhabited place on Earth.",
    image: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?auto=format&fit=crop&w=1200&q=80",
    icon: <FiCompass />,
    tag: "Adventure"
  },
  {
    title: "Timket Festival",
    desc: "Join thousands of pilgrims in Gondar for the Feast of Epiphany, a kaleidoscope of white robes, gold umbrellas, and spiritual song.",
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200",
    icon: <FiMusic />,
    tag: "Spiritual"
  },
  {
    title: "Simien Wildlife Safari",
    desc: "Trek alongside Gelada monkeys and scan the cliffs for the rare Walia Ibex in the roof of Africa.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    icon: <FiCamera />,
    tag: "Nature"
  }
];

export default function ExperiencesPage() {
  return (
    <main className="bg-white dark:bg-[#050b18] text-slate-900 dark:text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1920&q=80" 
          alt="Ethiopian Experiences"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-white dark:to-[#050b18]" />
        
        <div className="container relative h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-black uppercase tracking-[0.4em] text-blue-400 mb-4">
              Signature Journeys
            </p>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9] uppercase">
              Curated <br />
              <span className="text-blue-400">Experiences</span>.
            </h1>
            <p className="mt-8 text-xl text-white/80 font-medium max-w-xl">
              Beyond the destination lies the memory. Explore the hand-crafted encounters that define the EthioTravel spirit.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Grid Section */}
      <section className="py-24">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12">
            {EXPERIENCES.map((exp, idx) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative h-[600px] rounded-[3.5rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-100 dark:border-white/5"
              >
                <Image src={exp.image} alt={exp.title} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051128] via-[#051128]/40 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="h-14 w-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-2xl shadow-xl shadow-blue-600/30">
                      {exp.icon}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">{exp.tag}</p>
                      <h3 className="text-3xl font-black text-white uppercase tracking-tighter">{exp.title}</h3>
                    </div>
                  </div>
                  <p className="text-white/70 text-lg leading-relaxed mb-8">
                    {exp.desc}
                  </p>
                  <Link href="/contact">
                    <button className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] px-8 py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center gap-2">
                      Request Private Plan <FiArrowRight />
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 mb-24">
        <div className="bg-[#f8faff] dark:bg-white/5 rounded-[4rem] p-16 lg:p-32 text-center border border-slate-100 dark:border-white/10 shadow-xl shadow-blue-900/5">
           <h2 className="text-5xl font-black text-[#051128] dark:text-white uppercase tracking-tighter mb-8 leading-tight">
             Design Your Own <br /> <span className="text-blue-600">Masterpiece</span>
           </h2>
           <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mx-auto mb-12 font-medium">
             Every traveler is unique. Talk to our concierge team to build a completely bespoke itinerary based on your passions.
           </p>
           <Link href="/contact" className="inline-flex px-12 py-6 bg-blue-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-600/30 hover:bg-blue-500 transition-all">
             Start Bespoke Design
           </Link>
        </div>
      </section>
    </main>
  );
}
