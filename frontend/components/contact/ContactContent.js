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
        adminTarget: "Ashenafi Abebe",
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
    <main className="bg-[#f8faff] min-h-screen py-24">
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
                desc="+251 911 123 456"
                sub="Available 24/7 for active travelers"
              />
              <ContactInfoCard 
                icon={<FiMail className="text-blue-600" />}
                title="Email Enquiries"
                desc="hello@ethiotravel.com"
                sub="concierge@ethiotravel.com"
              />
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="relative h-[300px] rounded-[3rem] overflow-hidden bg-slate-200 shadow-lg border-4 border-white"
            >
               <Image 
                src="https://images.unsplash.com/photo-1547036967-23d11aaca7dc?auto=format&fit=crop&w=800&q=80" 
                alt="Map Placeholder"
                fill
                className="object-cover opacity-50 grayscale"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <button className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-xl flex items-center gap-2">
                    <FiNavigation className="text-blue-600" /> Open in Navigation
                  </button>
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

        {/* Footer Meta */}
        <footer className="mt-32 pt-16 border-t border-slate-200">
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            <div>
              <p className="text-2xl font-black text-[#051128] uppercase">EthioTravel</p>
              <p className="text-sm text-slate-400 mt-4 max-w-xs font-medium">Crafting bespoke adventures across the historic and natural wonders of Ethiopia since 2012.</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mt-8">© 2026 EthioTravel. All rights reserved.</p>
            </div>
            <div className="grid grid-cols-2 gap-16">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Company</p>
                <ul className="space-y-3 text-[10px] font-black uppercase tracking-widest text-slate-600">
                  <li><Link href="/about" className="hover:text-blue-600 transition">About Us</Link></li>
                  <li><Link href="/about" className="hover:text-blue-600 transition">Sustainability</Link></li>
                  <li><Link href="/contact" className="hover:text-blue-600 transition">Partner with us</Link></li>
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
