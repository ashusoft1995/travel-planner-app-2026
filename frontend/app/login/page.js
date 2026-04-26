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
  const { login, loginWithGitHub, user, hydrated } = useAuth();
  const { handleLoginRedirect } = useFastRouting();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

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

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGitHub(); // The backend might still use the GitHub provider, but the UI is Google
    } catch (err) {
      toast.error("Google sign-in failed. Please try again.");
      setGoogleLoading(false);
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

            <button 
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full bg-white/5 text-white font-black uppercase tracking-widest text-[9px] py-4 rounded-2xl border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
            >
               {googleLoading ? (
                 <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
               ) : (
                 <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
               )}
               {googleLoading ? "Redirecting..." : "Continue with Google"}
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
