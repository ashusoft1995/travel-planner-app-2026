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
    <main className="relative min-h-[100vh] w-full flex items-center justify-center py-20 px-6 bg-[#050510]">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000" 
          alt="Highland"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-transparent to-[#050510]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[350px] bg-white/5 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-8 shadow-3xl border border-white/10 my-20"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2">Welcome Back</h1>
          <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Secure Access Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <div className="relative">
              <FiMail className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Email or Username"
                value={form.identifier}
                onChange={(e) => setForm({...form, identifier: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <FiLock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="password" 
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
            </div>
            <div className="flex justify-end px-1">
              <Link href="/forgot-password" title="Account Recovery" className="text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition">Forgot Password?</Link>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading ? "Verifying..." : "Sign In"} <FiArrowRight size={14} />
          </button>
        </form>

        <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-full border-t border-white/5"></div>
              <span className="relative z-10 px-4 bg-[#050510]/50 rounded-full text-[8px] font-black uppercase tracking-widest text-white/30">Quick Auth</span>
            </div>

            <button className="w-full bg-white/5 text-white font-black uppercase tracking-widest text-[9px] py-4 rounded-2xl border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
               <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" className="w-4 h-4" alt="Google" /> Continue with Google
            </button>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold text-white/40">
          New Explorer? <Link href="/signup" className="text-blue-400 font-black uppercase tracking-tighter hover:underline ml-1">Create Account</Link>
        </p>
      </motion.div>

      {/* Back to Home Link */}
      <Link href="/" className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition group z-10">
        <FiArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" /> Back to exploration
      </Link>
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
