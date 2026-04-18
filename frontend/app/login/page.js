"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiLock, FiMail, FiUser, FiArrowRight, FiHeadphones } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import useFastRouting from "../../hooks/useFastRouting";
import { motion } from "framer-motion";
import Image from "next/image";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { login, user, hydrated, isAdmin } = useAuth();
  const { handleLoginRedirect } = useFastRouting();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated || !user) return;
    handleLoginRedirect(user, next);
  }, [hydrated, user, next, handleLoginRedirect]);

  if (hydrated && user) {
    return <div className="min-h-screen bg-[#f8faff]" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = form.identifier.trim();
    if (!id || form.password.length < 6) {
      toast.error("Please enter valid credentials");
      return;
    }
    setLoading(true);
    try {
      const signedIn = await login(id, form.password);
      toast.success("Welcome back. You're signed in.");
      handleLoginRedirect(signedIn, next);
    } catch (err) {
      toast.error(err?.message || "Invalid credentials");
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
          className="object-cover scale-105"
          priority
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-[500px] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-10 lg:p-14 shadow-2xl border border-white/30 dark:border-white/10"
      >
        <div className="text-center mb-10">
          <p className="text-2xl font-black text-[#051128] uppercase tracking-tighter mb-4">EthioTravel</p>
          <h1 className="text-4xl font-black text-[#051128] tracking-tighter uppercase mb-3">Welcome Back</h1>
          <p className="text-slate-600 text-sm font-medium">Enter your credentials to access your digital travel planner.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#051128]/60 text-lg" />
              <input 
                type="text" 
                placeholder="alexander@luxurytravel.com"
                value={form.identifier}
                onChange={(e) => setForm({...form, identifier: e.target.value})}
                className="w-full bg-white border-none rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-3 px-1">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
              <Link href="/forgot-password" title="Account Recovery" className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition">Forgot?</Link>
            </div>
            <div className="relative">
              <FiLock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#051128]/60 text-lg" />
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full bg-white border-none rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3"
          >
            {loading ? "Authenticating..." : "Sign In"} <FiArrowRight />
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
          Don't have an account? <Link href="/signup" className="text-blue-600 font-black uppercase tracking-tighter hover:underline ml-1">Create Account</Link>
        </p>

        <div className="mt-10 flex justify-center gap-6">
           <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition">Privacy</Link>
           <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition">Terms</Link>
           <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition">Support</Link>
        </div>
      </motion.div>

      {/* Back to Home Link */}
      <Link href="/" className="absolute bottom-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition group z-10">
        <FiArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to main exploration
      </Link>

      {/* Support Badge */}
      <div className="absolute bottom-10 right-10 z-10 hidden lg:block">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/50 flex items-center gap-4">
           <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <FiHeadphones className="text-blue-600" />
           </div>
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Live Concierge</p>
              <p className="text-[10px] text-slate-500 font-bold">Need help logging in?</p>
           </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8faff] flex items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
