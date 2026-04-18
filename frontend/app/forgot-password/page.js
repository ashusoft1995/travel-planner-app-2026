"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiMail, FiArrowRight, FiChevronLeft } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
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
    await new Promise((r) => setTimeout(r, 800));
    requestPasswordReset(email);
    toast.success(
      "If this email exists in our system, a secure link has been sent."
    );
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#f8faff] flex flex-col items-center justify-center p-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[480px] bg-white rounded-[3rem] p-10 lg:p-14 shadow-2xl shadow-blue-900/5 border border-slate-100"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#051128] tracking-tighter uppercase mb-4">Forgot Password?</h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Enter the email address associated with your EthioTravel account and we'll send you a secure link to reset your credentials.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-600 text-lg" />
              <input 
                type="email" 
                placeholder="concierge@ethiotravel.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#f0f4ff] border-none rounded-2xl pl-14 pr-6 py-5 text-slate-900 font-bold placeholder:text-slate-300 focus:ring-2 focus:ring-blue-500 transition-all"
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

        <div className="mt-12 pt-10 border-t border-slate-50 flex justify-center">
          <Link href="/login" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500 transition">
            <FiChevronLeft /> Return to Login
          </Link>
        </div>
      </motion.div>

      <div className="mt-12 text-center">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300">© 2024 EthioTravel. The Ethereal Navigator.</p>
        <div className="flex justify-center gap-6 mt-6">
           <Link href="/privacy" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-500">Privacy Policy</Link>
           <Link href="/terms" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-500">Terms of Service</Link>
        </div>
        <div className="flex justify-center gap-6 mt-4">
           <Link href="/register" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-500">Agent Portal</Link>
           <Link href="/contact" className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-500">Support</Link>
        </div>
      </div>
    </main>
  );
}
