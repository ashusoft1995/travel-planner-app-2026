"use client";

import { motion } from "framer-motion";
import { 
  FiAward, FiGlobe, FiHeart, FiUsers, FiLeaf, FiShield, FiDroplet, FiStar, FiChevronRight 
} from "react-icons/fi";
import Image from "next/image";
import Link from "next/link";

export default function AboutContent() {
  return (
    <main className="bg-white dark:bg-[var(--bg)] text-slate-900 dark:text-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1544735716-7c0b88f3f2a3?q=80&w=1200" 
          alt="Abyssinian Highlands"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white" />
        
        <div className="container relative h-full flex flex-col justify-center pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="text-xs font-black uppercase tracking-[0.4em] text-white/70 mb-4">
              About EthioTravel
            </p>
            <h1 className="text-6xl lg:text-8xl font-black tracking-tighter text-white leading-[0.9]">
              The Soul of the <br />
              <span className="text-blue-400">Abyssinian</span> <br />
              Highlands.
            </h1>
            <p className="mt-8 text-xl text-white/80 font-medium max-w-xl leading-relaxed">
              Our mission is to bridge the gap between world-class luxury and the raw, ancient heritage of Ethiopia. We curate journeys that don't just move you through space, but through time.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Our Heritage */}
      <section className="py-24 lg:py-32">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-[3rem] overflow-hidden shadow-2xl"
            >
              <Image 
                src="https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=1200" 
                alt="Lalibela Heritage"
                fill
                className="object-cover"
              />
            </motion.div>
            <div className="space-y-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl font-black tracking-tight text-slate-900 mb-6">Our Heritage</h2>
                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  Founded on the principles of deep cultural immersion, EthioTravel emerged from a passion to showcase the unparalleled majesty of the Horn of Africa. From the monolithic of Aksum to the spiritual silence of Lalibela, our roots are firmly planted in the history we share.
                </p>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                  We believe that luxury isn't just about high-thread-count linens; it's about the exclusive access to stories untold and paths untraveled. Our heritage is the landscape of Ethiopia itself — diverse, resilient, and breathtakingly beautiful.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                <div>
                  <p className="text-4xl font-black text-blue-600">12+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Years Experience</p>
                </div>
                <div>
                  <p className="text-4xl font-black text-blue-600">500+</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Local Partners</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Travel */}
      <section className="py-24 bg-slate-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Sustainable Travel</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">
              Preserving the wonders we explore. Our commitment to the environment and local communities is at the heart of every itinerary.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <SustainabilityCard 
              icon={<FiLeaf className="text-blue-500" />}
              title="Carbon-Neutral Journeys"
              desc="We offset 100% of our travel emissions through reforestation projects in the Bale Mountains, ensuring your journey leaves the world better than you found it."
              bg="bg-white"
            />
            <SustainabilityCard 
              icon={<FiShield className="text-white" />}
              title="Community Wealth"
              desc="80% of our operations budget stays within the local communities we visit, supporting schools, healthcare, and artisanal workshops."
              bg="bg-[#051128] text-white"
            />
            <SustainabilityCard 
              icon={<FiDroplet className="text-blue-500" />}
              title="Water Preservation"
              desc="Collaborating with lodges that utilize advanced grey-water recycling and solar desalination technologies across the Danakil region."
              bg="bg-blue-600 text-white"
              whiteIcon
            />
            <SustainabilityCard 
              icon={<FiStar className="text-blue-500" />}
              title="Wildlife Protection"
              desc="Partnering with the EWCP to protect the endemic Ethiopian Wolf through non-invasive tourism and habitat restoration programs."
              bg="bg-white"
            />
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-white dark:bg-[var(--bg)]">
        <div className="container">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Our Core Team</h2>
            <h3 className="text-5xl font-black text-[#051128] dark:text-white uppercase tracking-tighter">The Architects of <span className="text-blue-600">Your Journey</span></h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: "Ashu", role: "Founder & CEO", photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=800" },
              { name: "Jemile", role: "Head of Cultural Heritage", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800" },
              { name: "Bire", role: "Logistics Specialist", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800" },
              { name: "Elsa", role: "Guest Relations Director", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800" },
            ].map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-6">
                  <Image src={member.photo} alt={member.name} fill className="object-cover grayscale transition-all duration-500 group-hover:grayscale-0 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#051128]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-2xl font-black text-[#051128] dark:text-white uppercase tracking-tighter">{member.name}</h4>
                <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mt-1">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Concierge Section */}
      <section className="py-24">
        <div className="container">
          <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 min-h-[500px] flex items-center">
            <Image 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200" 
              alt="Concierge"
              fill
              className="object-cover opacity-60 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent" />
            
            <div className="relative z-10 p-12 lg:p-24 max-w-2xl">
              <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[2rem] p-10 shadow-2xl">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-400 mb-2">Personalized Excellence</p>
                <h3 className="text-4xl font-black text-white mb-6">Meet the Concierge</h3>
                <p className="text-white/70 italic leading-relaxed mb-8">
                  "Every journey we design is a personal letter to our guests. We don't just book hotels; we architect memories. My team and I are here to ensure that every sunrise you witness and every meal you share is infused with the true essence of Ethiopia."
                </p>
                
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center">
                    <FiChevronRight className="text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold">Plan Online</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Local Experience Architect</p>
                  </div>
                </div>

                <Link href="/contact">
                  <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/30">
                    Start Your Private Consultation
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-slate-50 dark:bg-white/5">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            {[
              { title: "Authenticity", desc: "We don't do 'tourist traps'. Every experience is vetted for genuine cultural value.", icon: <FiAward /> },
              { title: "Preservation", desc: "A portion of every booking goes directly to heritage site restoration projects.", icon: <FiShield /> },
              { title: "Excellence", desc: "From the first click to the final flight, every detail is handled with precision.", icon: <FiStar /> },
            ].map((value) => (
              <div key={value.title} className="p-12 rounded-[3rem] bg-white dark:bg-[var(--bg)] border border-slate-100 dark:border-white/5 shadow-xl shadow-blue-900/5">
                <div className="h-16 w-16 rounded-2xl bg-blue-600/10 dark:bg-purple-500/10 flex items-center justify-center text-3xl text-blue-600 dark:text-purple-400 mb-8">
                  {value.icon}
                </div>
                <h4 className="text-2xl font-black text-[#051128] dark:text-white uppercase tracking-tighter mb-4">{value.title}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Vision */}
      <section className="py-32 overflow-hidden">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center gap-24">
            <div className="lg:w-1/2 space-y-8">
               <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600">Global Vision</h2>
               <h3 className="text-6xl font-black text-[#051128] dark:text-white uppercase tracking-tighter leading-[0.9]">Connecting <br /> Ethiopia to <br /> <span className="text-blue-600">The World</span></h3>
               <p className="text-xl text-slate-500 dark:text-slate-400 font-medium max-w-lg">
                 Our platform isn't just a booking tool; it's a bridge. We are committed to making Ethiopia the world's premier destination for luxury cultural tourism.
               </p>
               <div className="pt-8 grid grid-cols-2 gap-12 border-t border-slate-100 dark:border-white/10">
                  <div>
                    <p className="text-5xl font-black text-[#051128] dark:text-white">2.4M</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Annual Reach</p>
                  </div>
                  <div>
                    <p className="text-5xl font-black text-blue-600">100%</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Local Sourcing</p>
                  </div>
               </div>
            </div>
            <div className="lg:w-1/2 relative">
               <div className="relative aspect-square rounded-[4rem] overflow-hidden shadow-2xl">
                  <Image 
                    src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200" 
                    alt="Global Vision"
                    fill
                    className="object-cover"
                  />
               </div>
               <div className="absolute -bottom-10 -left-10 h-64 w-64 bg-blue-600 rounded-[3rem] p-10 flex flex-col justify-end text-white shadow-2xl">
                  <FiGlobe size={40} className="mb-6" />
                  <p className="text-sm font-black uppercase tracking-widest">Global Headquarters <br /> Addis Ababa</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Meta */}
      <footer className="py-12 border-t border-slate-100">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="max-w-xs text-center md:text-left">
            <p className="text-lg font-black text-slate-900 uppercase">EthioTravel</p>
            <p className="text-xs text-slate-400 mt-2 font-medium">Crafting exceptional journeys across the historic landscape of Ethiopia since 2012.</p>
          </div>
          <div className="flex gap-12 text-center md:text-left">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">Explore</p>
              <ul className="space-y-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-blue-600 transition">Terms of Service</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-4">Resources</p>
              <ul className="space-y-2 text-xs font-bold text-slate-500 uppercase tracking-tighter">
                <li><Link href="/trips" className="hover:text-blue-600 transition">Travel Insurance</Link></li>
                <li><Link href="/about" className="hover:text-blue-600 transition">Sustainability</Link></li>
                <li><Link href="/contact" className="hover:text-blue-600 transition">Partner with us</Link></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="container mt-12 pt-8 border-t border-slate-50">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">© 2026 EthioTravel. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

function SustainabilityCard({ icon, title, desc, bg, whiteIcon }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className={`p-10 rounded-[2.5rem] shadow-sm border border-slate-100 transition-all ${bg}`}
    >
      <div className={`mb-8 text-3xl ${whiteIcon ? "text-white" : ""}`}>
        {icon}
      </div>
      <h4 className="text-xl font-black mb-4 tracking-tight">{title}</h4>
      <p className={`text-sm leading-relaxed ${bg.includes('white') ? 'text-slate-500' : 'opacity-70 font-medium'}`}>
        {desc}
      </p>
    </motion.div>
  );
}
