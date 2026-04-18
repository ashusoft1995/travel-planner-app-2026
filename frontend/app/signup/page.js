"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiLock, FiMail, FiUser, FiArrowRight, FiSearch, FiHeadphones } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import useFastRouting from "../../hooks/useFastRouting";
import { motion } from "framer-motion";
import Image from "next/image";

function SignupContent() {
  const router = useRouter();
  const { register, user, hydrated, isAdmin } = useAuth();
  const { handleLoginRedirect } = useFastRouting();
  const [form, setForm] = useState({ 
    name: "", email: "", username: "", password: "", confirm: "", role: "user",
    phone: "", expertise: [], about: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated || !user) return;
    handleLoginRedirect(user);
  }, [hydrated, user, handleLoginRedirect]);

  if (hydrated && user) {
    return <div className="min-h-screen bg-[#050510]" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const registeredUser = await register(
        form.name, form.email, form.password, 
        form.username || form.email.split('@')[0], 
        form.role,
        { phone: form.phone, expertise: form.expertise, about: form.about }
      );
      toast.success(form.role === "agent" ? "Expert application submitted for review!" : "Account created successfully!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error(err?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100vh] w-full flex items-center justify-center py-20 px-6 bg-[#050510]">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1585016495481-9161353f1ba2?q=80&w=2000" 
          alt="Ancient Aksum"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-transparent to-[#050510]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full ${form.role === "agent" ? "max-w-[450px]" : "max-w-[360px]"} bg-white/5 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-8 lg:p-10 shadow-3xl border border-white/10 transition-all duration-500 my-20`}
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-1">Join Azure</h1>
          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">Global Travel Network</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <RoleCard 
            active={form.role === "user"} 
            onClick={() => setForm({...form, role: "user"})}
            icon={<FiSearch className="text-blue-400 text-lg" />}
            title="Traveler"
          />
          <RoleCard 
            active={form.role === "agent"} 
            onClick={() => setForm({...form, role: "agent"})}
            icon={<FiHeadphones className="text-blue-400 text-lg" />}
            title="Expert"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <input 
              type="text" 
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({...form, name: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
              <input 
                type="email" 
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
            </div>
          </div>

          {form.role === "agent" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-3 pt-4 border-t border-white/5"
            >
              <p className="text-[9px] font-black uppercase tracking-widest text-blue-400 mb-4">Expert Verification</p>
              
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="tel" 
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Destinations (e.g. Lalibela)"
                  value={form.expertise}
                  onChange={(e) => setForm({...form, expertise: e.target.value.split(",")})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="relative group">
                    <label className="flex flex-col items-center justify-center h-24 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer group-hover:bg-white/10 transition-all">
                       <span className="text-[8px] font-black uppercase text-white/40 group-hover:text-blue-400">Legal Permit</span>
                       <span className="text-[7px] text-white/20 mt-1">Upload JPG/PNG</span>
                    </label>
                 </div>
                 <div className="relative group">
                    <label className="flex flex-col items-center justify-center h-24 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer group-hover:bg-white/10 transition-all">
                       <span className="text-[8px] font-black uppercase text-white/40 group-hover:text-blue-400">ID / Kebele</span>
                       <span className="text-[7px] text-white/20 mt-1">Front & Back</span>
                    </label>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <div className="relative group">
                    <label className="flex flex-col items-center justify-center h-24 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer group-hover:bg-white/10 transition-all">
                       <span className="text-[8px] font-black uppercase text-white/40 group-hover:text-blue-400">Professional CV</span>
                       <span className="text-[7px] text-white/20 mt-1">Experience Doc</span>
                    </label>
                 </div>
                 <div className="relative group">
                    <label className="flex flex-col items-center justify-center h-24 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer group-hover:bg-white/10 transition-all">
                       <span className="text-[8px] font-black uppercase text-white/40 group-hover:text-blue-400">Portfolio</span>
                       <span className="text-[7px] text-white/20 mt-1">Tour Images</span>
                    </label>
                 </div>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input 
              type="password" 
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
            <input 
              type="password" 
              placeholder="Confirm"
              value={form.confirm}
              onChange={(e) => setForm({...form, confirm: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? "Verifying Credentials..." : form.role === "agent" ? "Submit Expert Application" : "Create Traveler Account"} <FiArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-full border-t border-white/5"></div>
              <span className="relative z-10 px-4 bg-[#050510]/50 rounded-full text-[8px] font-black uppercase tracking-widest text-white/30">Auth Sync</span>
            </div>

            <button className="w-full bg-white/5 text-white font-black uppercase tracking-widest text-[9px] py-3.5 rounded-2xl border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
               <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-4 h-4" alt="Google" /> Continue with Google
            </button>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-white/40">
          Member? <Link href="/login" className="text-blue-400 font-black uppercase tracking-tighter hover:underline ml-1">Log in here</Link>
        </p>
      </motion.div>

      {/* Back to Home Link */}
      <Link href="/" className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition group z-10">
        <FiArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to exploration
      </Link>
    </main>
  );
}

function RoleCard({ active, onClick, icon, title }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`p-4 rounded-[2rem] border transition-all flex flex-col items-center gap-2 flex-1 ${
        active 
          ? "bg-white/10 border-blue-600 shadow-xl shadow-blue-600/10" 
          : "bg-white/[0.02] border-white/5 grayscale hover:grayscale-0 hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest text-white">{title}</span>
    </button>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faff] flex items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /></div>}>
      <SignupContent />
    </Suspense>
  );
}
