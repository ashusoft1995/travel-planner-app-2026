"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiMail, FiArrowRight, FiChevronLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter a valid email address");
      return;
    }
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      requestPasswordReset(email);
      toast.success(
        "If this email exists in our system, a secure link has been sent."
      );
      // Small delay before redirecting back to login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100vh] w-full flex items-center justify-center py-20 px-6 bg-[#050510]">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000" 
          alt="Highland"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-transparent to-[#050510]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[420px] bg-white/5 dark:bg-slate-900/40 backdrop-blur-3xl rounded-[3rem] p-10 lg:p-14 shadow-3xl border border-white/10 my-20"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-4">Account Recovery</h1>
          <p className="text-white/50 text-xs font-medium leading-relaxed">
            Enter the email address associated with your EthioTravel account and we'll send you a secure link to reset your credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-white/40 mb-3 ml-1">Registered Email</label>
            <div className="relative">
              <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 text-lg" />
              <input 
                type="email" 
                placeholder="concierge@ethiotravel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white font-bold placeholder:text-white/10 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/30 flex items-center justify-center gap-3"
          >
            {loading ? "Transmitting..." : "Send Reset Link"} <FiArrowRight />
          </button>
        </form>

        <div className="mt-12 pt-10 border-t border-white/5 flex justify-center">
          <Link href="/login" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition group">
            <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Return to Login
          </Link>
        </div>
      </motion.div>

      {/* Footer Branding */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 text-center opacity-40 z-10">
        <p className="text-[10px] font-black uppercase tracking-widest text-white">© 2026 EthioTravel. The Ethereal Navigator.</p>
      </div>
    </main>
  );
}
