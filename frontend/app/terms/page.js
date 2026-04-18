"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiFileText, FiArrowLeft } from "react-icons/fi";

export default function TermsPage() {
  return (
    <main className="bg-white dark:bg-[var(--bg)] text-slate-900 dark:text-white min-h-screen py-32">
      <div className="container max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 mb-12 hover:translate-x-[-4px] transition-transform">
          <FiArrowLeft /> Back to Home
        </Link>
        
        <div className="space-y-12">
          <div>
            <FiFileText className="text-6xl text-blue-600 mb-8" />
            <h1 className="text-6xl font-black tracking-tighter uppercase mb-6">Terms of <br /><span className="text-blue-600">Service</span></h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              The operational framework for your journey. By utilizing the EthioTravel platform, you agree to these foundational principles.
            </p>
          </div>

          <div className="space-y-10">
             <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">1. Booking Agreement</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">All itineraries are subject to regional availability and local cultural schedules. Confirmations are finalized upon deposit.</p>
             </section>
             <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">2. Cancellation Policy</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Cancellations made within 30 days of departure are subject to varied recovery fees based on partner lodge policies.</p>
             </section>
             <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">3. Conduct</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Guests are expected to maintain the highest respect for local traditions and heritage sites throughout their journey.</p>
             </section>
          </div>
        </div>
      </div>
    </main>
  );
}
