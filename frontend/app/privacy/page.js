"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiShield, FiArrowLeft } from "react-icons/fi";

export default function PrivacyPage() {
  return (
    <main className="bg-white dark:bg-[var(--bg)] text-slate-900 dark:text-white min-h-screen py-32">
      <div className="container max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-blue-600 mb-12 hover:translate-x-[-4px] transition-transform">
          <FiArrowLeft /> Back to Home
        </Link>
        
        <div className="space-y-12">
          <div>
            <FiShield className="text-6xl text-blue-600 mb-8" />
            <h1 className="text-6xl font-black tracking-tighter uppercase mb-6">Privacy <br /><span className="text-blue-600">Protocol</span></h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Your privacy is the bedrock of our trust. This document outlines how we protect your digital footprint across the EthioTravel network.
            </p>
          </div>

          <div className="space-y-10">
             <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">1. Data Collection</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">We collect essential information to facilitate your travel arrangements, including identity verification and regional preferences.</p>
             </section>
             <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">2. Information Usage</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">Your data is utilized exclusively for itinerary design, booking synchronization, and personalized concierge support.</p>
             </section>
             <section className="space-y-4">
                <h2 className="text-2xl font-black uppercase tracking-tight">3. Security</h2>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">All transmissions are encrypted via industry-standard protocols and stored in our secure Abyssinian data centers.</p>
             </section>
          </div>
        </div>
      </div>
    </main>
  );
}
