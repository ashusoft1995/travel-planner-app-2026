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
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", confirm: "", role: "user" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated || !user) return;
    handleLoginRedirect(user);
  }, [hydrated, user, handleLoginRedirect]);

  if (hydrated && user) {
    return <div className="min-h-screen bg-[#f8faff]" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const registeredUser = await register(form.name, form.email, form.password, form.username || form.email.split('@')[0], form.role);
      toast.success("Account created successfully!");
      setTimeout(() => {
        handleLoginRedirect(registeredUser);
      }, 1500);
    } catch (err) {
      toast.error(err?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center p-6 overflow-hidden">
      {/* Dynamic Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1544735716-7c0b88f3f2a3?auto=format&fit=crop&w=1920&q=80" 
          alt="Ethiopian Highlands"
          fill
          className="object-cover scale-100"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[1px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[440px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-10 shadow-2xl border border-white/30 dark:border-white/10"
      >
        <div className="text-center mb-10">
          <p className="text-2xl font-black text-[#051128] uppercase tracking-tighter mb-4">EthioTravel</p>
          <h1 className="text-4xl font-black text-[#051128] tracking-tighter uppercase mb-3">Create Account</h1>
          <p className="text-slate-600 text-sm font-medium">Join our community of global travelers and experts.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-10">
          <RoleCard 
            active={form.role === "user"} 
            onClick={() => setForm({...form, role: "user"})}
            icon={<FiSearch className="text-blue-600 text-2xl" />}
            title="Traveler"
          />
          <RoleCard 
            active={form.role === "agent"} 
            onClick={() => setForm({...form, role: "agent"})}
            icon={<FiHeadphones className="text-blue-600 text-2xl" />}
            title="Agent Expert"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})}
            className="w-full bg-white border-none rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            required
          />
          <input 
            type="email" 
            placeholder="Email Address"
            value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})}
            className="w-full bg-white border-none rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            required
          />
          <input 
            type="password" 
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})}
            className="w-full bg-white border-none rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            required
          />
          <input 
            type="password" 
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) => setForm({...form, confirm: e.target.value})}
            className="w-full bg-white border-none rounded-2xl px-6 py-5 text-slate-900 font-bold placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
            required
          />

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3 mt-4"
          >
            {loading ? "Registering..." : "Complete Registration"} <FiArrowRight />
          </button>
        </form>

        <div className="mt-8">
            <div className="relative flex items-center justify-center mb-8">
              <div className="absolute w-full border-t border-slate-200"></div>
              <span className="relative z-10 px-4 bg-white/10 rounded-full backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-slate-500">Or continue with</span>
            </div>

            <button className="w-full bg-[#f0f4ff] text-slate-900 font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center gap-3 hover:bg-white transition-all">
               <Image src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" width={18} height={18} alt="Google" /> Continue with Google
            </button>
        </div>

        <p className="mt-10 text-center text-xs font-medium text-slate-500">
          Already have an account? <Link href="/login" className="text-blue-600 font-black uppercase tracking-tighter hover:underline ml-1">Log in here</Link>
        </p>
      </motion.div>

      {/* Back to Home Link */}
      <Link href="/" className="absolute bottom-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition group z-10">
        <FiArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to main exploration
      </Link>
    </main>
  );
}

function RoleCard({ active, onClick, icon, title }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-3 ${
        active 
          ? "bg-white border-blue-600 shadow-xl shadow-blue-600/10" 
          : "bg-[#f0f4ff]/50 border-transparent grayscale hover:grayscale-0 hover:bg-white"
      }`}
    >
      {icon}
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">{title}</span>
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
