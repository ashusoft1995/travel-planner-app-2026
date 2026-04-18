"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiMail, FiMapPin, FiPhone, FiSend, FiNavigation, FiClock, FiCheck
} from "react-icons/fi";
import { submitContactMessage, fetchMyContactMessages, friendlyApiMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import Image from "next/image";

export default function ContactContent() {
  const { user, hydrated } = useAuth();
  const [myMessages, setMyMessages] = useState([]);
  const [inquiryType, setInquiryType] = useState("Lalibela Tour");
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [adminTarget, setAdminTarget] = useState("Ashu");

  useEffect(() => {
    if (!hydrated || !user) return;
    setForm((p) => ({
      ...p,
      name: p.name.trim() ? p.name : user.name || "",
      email: p.email.trim() ? p.email : user.email || "",
    }));
  }, [hydrated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill required fields");
      return;
    }
    setLoading(true);
    try {
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: inquiryType,
        message: form.message.trim(),
        adminTarget: adminTarget,
      });
      toast.success(`Message sent. Our designers will reach out shortly.`);
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        message: "",
      });
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-[#f8faff] dark:bg-[var(--bg)] min-h-screen py-24">
      <div className="container max-w-7xl">
        <div className="mb-16">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Personalized Assistance</p>
          <h1 className="text-6xl font-black text-[#051128] tracking-tighter mb-6 uppercase">Reach Out to Your <span className="text-blue-600">Concierge</span></h1>
          <p className="text-slate-500 text-lg max-w-2xl font-medium leading-relaxed">
            Experience Ethiopia through a lens of curated luxury. Our dedicated travel designers are ready to craft your next unforgettable journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-white rounded-[3rem] p-12 shadow-xl shadow-blue-900/5 border border-slate-100"
          >
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="Abebe Bikila"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    className="w-full bg-[#f0f4ff] border-none rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="abebe@example.com"
                    value={form.email}
                    onChange={(e) => setForm({...form, email: e.target.value})}
                    className="w-full bg-[#f0f4ff] border-none rounded-2xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Assign Concierge</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {["Ashu", "Jemile", "Bire", "Elsa"].map((admin) => (
                    <button
                      key={admin}
                      type="button"
                      onClick={() => setAdminTarget(admin)}
                      className={`py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all border-2 ${
                        adminTarget === admin 
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20" 
                        : "bg-[#f0f4ff] border-transparent text-slate-400 hover:bg-slate-100"
                      }`}
                    >
                      {admin}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">Inquiry Type</label>
                <div className="flex flex-wrap gap-3">
                  {["Lalibela Tour", "Simien Trek", "Danakil Exp.", "Custom Trip"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setInquiryType(type)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        inquiryType === type 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                          : "bg-[#f0f4ff] text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Your Vision</label>
                <textarea 
                  rows={6}
                  placeholder="Tell us about the dream experience you want us to curate..."
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})}
                  className="w-full bg-[#f0f4ff] border-none rounded-2xl px-6 py-6 text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3"
              >
                {loading ? "Transmitting..." : "Send Message"} <FiSend />
              </button>
            </form>
          </motion.div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#f0f4ff] rounded-[3rem] p-10 space-y-10"
            >
              <ContactInfoCard 
                icon={<FiMapPin className="text-blue-600" />}
                title="Headquarters"
                desc="Bole Road, Mega Building, 4th Floor Addis Ababa, Ethiopia"
              />
              <ContactInfoCard 
                icon={<FiPhone className="text-blue-600" />}
                title="Concierge Desk"
                desc="0997255611"
                sub="Telegram: @Ashubro"
              />
              <ContactInfoCard 
                icon={<FiMail className="text-blue-600" />}
                title="Email Enquiries"
                desc="ashenafiabebe@gmail.com"
                sub="Official: hello@ethiotravel.com"
              />
            </motion.div>

             <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-[300px] rounded-[3rem] overflow-hidden bg-slate-200 shadow-lg border-4 border-white dark:border-white/10"
             >
                <Image 
                 src="https://images.unsplash.com/photo-1547036967-23d11aaca7dc?auto=format&fit=crop&w=800&q=80" 
                 alt="Map Placeholder"
                 fill
                 className="object-cover opacity-50 grayscale"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <a 
                     href="https://www.google.com/maps/search/?api=1&query=Bole+Road+Mega+Building+Addis+Ababa+Ethiopia" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white shadow-xl flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105"
                   >
                     <FiNavigation className="text-blue-600 group-hover:text-white" /> Open in Navigation
                   </a>
                </div>
             </motion.div>

            <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm">
               <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><FiClock /> Service Hours</h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-tighter text-slate-700">
                    <span>Monday — Friday</span>
                    <span className="text-blue-600">08:00 - 18:00 EAT</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-black uppercase tracking-tighter text-slate-700">
                    <span>Saturday</span>
                    <span className="text-blue-600">09:00 - 13:00 EAT</span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Support Team Section */}
        <section className="mt-24 pt-24 border-t border-slate-100 dark:border-white/5">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 mb-16">
            <div className="max-w-xl">
              <h3 className="text-4xl font-black text-[#051128] dark:text-white uppercase tracking-tighter mb-4">Meet Your <span className="text-blue-600 dark:text-purple-400">Personal Support</span> Team</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">Our elite concierge specialists are available 24/7 to ensure your Ethiopian journey is flawless. From logistics to cultural immersion, we've got you covered.</p>
            </div>
            <div className="flex -space-x-4">
              {["Ashu", "Jemile", "Bire", "Elsa"].map((name, i) => (
                <div key={name} className={`relative h-20 w-20 rounded-full border-4 border-white dark:border-[#050b18] overflow-hidden shadow-xl z-${40 - i * 10}`}>
                   <Image 
                    src={`https://images.unsplash.com/photo-${1500000000000 + i * 1234567}?auto=format&fit=crop&w=200&h=200&q=80`} 
                    alt={name} 
                    fill 
                    className="object-cover"
                   />
                </div>
              ))}
              <div className="relative h-20 w-20 rounded-full border-4 border-white dark:border-[#050b18] bg-blue-600 flex items-center justify-center shadow-xl z-0">
                <span className="text-white text-xs font-black">+12</span>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Ashu", status: "Active Now", icon: <FiCheck className="text-emerald-500" /> },
              { name: "Jemile", status: "Active Now", icon: <FiCheck className="text-emerald-500" /> },
              { name: "Bire", status: "In Session", icon: <FiClock className="text-amber-500" /> },
              { name: "Elsa", status: "Active Now", icon: <FiCheck className="text-emerald-500" /> },
            ].map((member) => (
              <div key={member.name} className="bg-white dark:bg-white/5 p-6 rounded-[2rem] border border-slate-100 dark:border-white/10 flex items-center justify-between group hover:shadow-lg transition-all">
                <div>
                  <p className="text-sm font-black text-[#051128] dark:text-white uppercase tracking-tighter">{member.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mt-1">{member.icon} {member.status}</p>
                </div>
                <button className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/10 flex items-center justify-center text-[#051128] dark:text-white group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <FiSend size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Office Locations */}
        <section className="mt-32">
          <div className="text-center mb-20">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-blue-600 mb-4">Our Presence</h2>
            <h3 className="text-5xl font-black text-[#051128] dark:text-white uppercase tracking-tighter">Global <span className="text-blue-600">Offices</span></h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              { city: "Addis Ababa", addr: "Bole Medhanialem Road, Crystal Tower, 4th Floor", tel: "+251 11 661 2345", image: "https://images.unsplash.com/photo-1547036967-23d11aaca7dc?auto=format&fit=crop&w=800&q=80" },
              { city: "Gondar", addr: "Fasilides Square, Heritage House, Suite 12", tel: "+251 58 211 6789", image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80" },
            ].map((office) => (
              <div key={office.city} className="group relative h-[350px] rounded-[3rem] overflow-hidden shadow-2xl">
                <Image src={office.image} alt={office.city} fill className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#051128] via-[#051128]/40 to-transparent" />
                <div className="absolute bottom-10 left-10">
                   <h4 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">{office.city}</h4>
                   <p className="text-white/60 text-xs font-bold uppercase tracking-widest leading-relaxed mb-4 max-w-[250px]">{office.addr}</p>
                   <p className="text-blue-400 text-sm font-black">{office.tel}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mt-32 mb-16">
           <div className="bg-slate-50 dark:bg-white/5 rounded-[4rem] p-16 lg:p-24 border border-slate-100 dark:border-white/10">
              <div className="max-w-3xl">
                 <h3 className="text-4xl font-black text-[#051128] dark:text-white uppercase tracking-tighter mb-12">General <span className="text-blue-600">Inquiries</span></h3>
                 <div className="space-y-10">
                    {[
                      { q: "What is the best time to visit the Simien Mountains?", a: "The dry season between October and March offers the best trekking conditions and clearest views." },
                      { q: "Are custom itineraries available?", a: "Absolutely. Our concierge team specializes in bespoke journeys tailored to your specific interests and pace." },
                      { q: "How do I book a private guide?", a: "You can request a private guide through the 'Experiences' page or by contacting your assigned concierge specialist." },
                    ].map((faq, i) => (
                      <div key={i} className="space-y-3">
                         <p className="text-lg font-black text-[#051128] dark:text-white uppercase tracking-tight">{faq.q}</p>
                         <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        {/* Footer Meta */}
        <footer className="mt-32 pt-16 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <p className="text-2xl font-black text-[#051128] uppercase">EthioTravel</p>
              <p className="text-sm text-slate-400 mt-4 max-w-xs font-medium">Crafting bespoke adventures across the historic and natural wonders of Ethiopia since 2012.</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-8">© 2026 EthioTravel. All rights reserved.</p>
            </div>
            <div className="grid grid-cols-3 gap-16">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Company</p>
                <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
                  <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
                  <li><Link href="/about" className="hover:text-blue-600 transition">Sustainability</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-600 transition">Partner with us</Link></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Connect</p>
                <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
                  <li><a href="https://t.me/Ashubro" className="hover:text-blue-600 transition">Telegram</a></li>
                  <li><a href="https://github.com/ashu" className="hover:text-blue-600 transition">GitHub</a></li>
                  <li><a href="mailto:ashenafiabebe@gmail.com" className="hover:text-blue-600 transition">Email Ashu</a></li>
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Legal</p>
                <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
                  <li><Link href="/privacy" className="hover:text-blue-600 transition">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-blue-600 transition">Terms of Service</Link></li>
                  <li><Link href="/trips" className="hover:text-blue-600 transition">Travel Insurance</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}

function ContactInfoCard({ icon, title, desc, sub }) {
  return (
    <div className="flex gap-6">
      <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-md shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-sm font-black text-[#051128] uppercase mb-1">{title}</h4>
        <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-[200px]">{desc}</p>
        {sub && <p className="text-[10px] text-slate-400 mt-1 font-bold italic">{sub}</p>}
      </div>
    </div>
  );
}
