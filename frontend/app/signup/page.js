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
import { uploadFile } from "../../lib/supabase";

function SignupContent() {
  const router = useRouter();
  const { register, loginWithGitHub, user, hydrated } = useAuth();
  const { handleLoginRedirect } = useFastRouting();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [form, setForm] = useState({ 
    name: "", email: "", username: "", password: "", confirm: "", role: "user",
    phone: "", expertise: [], about: "",
    legal_paper_photo: null, experience_cv: null, experience_image: null, national_id_photo: null
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated || !user) return;
    handleLoginRedirect(user);
  }, [hydrated, user, handleLoginRedirect]);

  if (hydrated && user) {
    return <div className="min-h-screen bg-[#050510]" />;
  }

  const handleFileChange = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const toastId = toast.loading(`Uploading ${field.replace(/_/g, ' ')}...`);
    try {
      const url = await uploadFile(file);
      setForm(prev => ({ ...prev, [field]: url }));
      toast.success("File uploaded successfully", { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

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
        { 
          phone: form.phone, 
          expertise: form.expertise, 
          about: form.about,
          legal_paper_photo: form.legal_paper_photo,
          experience_cv: form.experience_cv,
          experience_image: form.experience_image,
          national_id_photo: form.national_id_photo
        }
      );
      toast.success(form.role === "agent" ? "Expert application submitted!" : "Account created!");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      toast.error(err?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  const handleGitHub = async () => {
    setGoogleLoading(true);
    try {
      await loginWithGitHub();
    } catch (err) {
      toast.error("GitHub sign-in failed. Please try again.");
      setGoogleLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full flex items-center justify-center py-32 px-6 bg-[#050510] overflow-hidden">
      {/* Immersive Background (Synced with Login) */}
      <div className="fixed inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2000" 
          alt="Highland"
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050510]/80 via-transparent to-[#050510]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative z-10 w-full ${form.role === "agent" ? "max-w-[480px]" : "max-w-[400px]"} bg-[#121421]/60 backdrop-blur-3xl rounded-[3.5rem] p-10 lg:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] border border-white/10 transition-all duration-500`}
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase mb-2">Join EthioTravel</h1>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Global Travel Network</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <RoleCard 
            active={form.role === "user"} 
            onClick={() => setForm({...form, role: "user"})}
            icon={<FiSearch className="text-lg" />}
            title="Traveler"
          />
          <RoleCard 
            active={form.role === "agent"} 
            onClick={() => setForm({...form, role: "agent"})}
            icon={<FiHeadphones className="text-lg" />}
            title="Expert"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className="relative">
              <FiUser className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                type="text" 
                placeholder="Full Name"
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-5 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Username"
                value={form.username}
                onChange={(e) => setForm({...form, username: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
              <input 
                type="email" 
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                required
              />
            </div>
          </div>

          {form.role === "agent" && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="space-y-4 pt-6 border-t border-white/5"
            >
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Professional Verification</p>
              
              <div className="grid grid-cols-2 gap-3">
                <input 
                  type="tel" 
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  required
                />
                <input 
                  type="text" 
                  placeholder="Destinations"
                  value={form.expertise}
                  onChange={(e) => setForm({...form, expertise: e.target.value.split(",")})}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                 <label className="flex flex-col items-center justify-center h-28 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group overflow-hidden relative">
                    {form.legal_paper_photo ? (
                      <img src={form.legal_paper_photo} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    ) : null}
                    <span className="text-[9px] font-black uppercase text-white/40 group-hover:text-blue-400 relative z-10">Permit Photo</span>
                    <span className="text-[8px] text-white/20 mt-1 relative z-10">{form.legal_paper_photo ? "Selected" : "Upload Required"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "legal_paper_photo")} />
                 </label>
                 <label className="flex flex-col items-center justify-center h-28 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-all group overflow-hidden relative">
                    {form.national_id_photo ? (
                      <img src={form.national_id_photo} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    ) : null}
                    <span className="text-[9px] font-black uppercase text-white/40 group-hover:text-blue-400 relative z-10">ID / Kebele</span>
                    <span className="text-[8px] text-white/20 mt-1 relative z-10">{form.national_id_photo ? "Selected" : "Both Sides"}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, "national_id_photo")} />
                 </label>
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <input 
              type="password" 
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({...form, password: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
            <input 
              type="password" 
              placeholder="Confirm"
              value={form.confirm}
              onChange={(e) => setForm({...form, confirm: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white text-xs font-bold placeholder:text-white/20 focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex items-center justify-center gap-3 mt-6 active:scale-95"
          >
            {loading ? "Verifying..." : form.role === "agent" ? "Apply as Expert" : "Create Account"} <FiArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6">
            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute w-full border-t border-white/5"></div>
              <span className="relative z-10 px-4 bg-[#050510]/50 rounded-full text-[8px] font-black uppercase tracking-widest text-white/30">Quick Auth</span>
            </div>

            <button 
              type="button"
              onClick={handleGitHub}
              disabled={googleLoading}
              className="w-full bg-white/5 text-white font-black uppercase tracking-widest text-[9px] py-4 rounded-2xl border border-white/10 flex items-center justify-center gap-3 hover:bg-white/10 transition-all disabled:opacity-50"
            >
               {googleLoading ? (
                 <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
               ) : (
                 <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
               )}
               {googleLoading ? "Redirecting..." : "Continue with GitHub"}
            </button>
        </div>

        <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-white/40 text-[10px] font-bold">
              ALREADY A MEMBER? <Link href="/login" className="text-blue-400 font-black uppercase tracking-tighter hover:underline ml-1">LOG IN HERE</Link>
            </p>
        </div>
      </motion.div>

      {/* Back Link */}
      <Link href="/" className="fixed bottom-10 left-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition group z-10">
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
      className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 flex-1 ${
        active 
          ? "bg-blue-600 border-blue-500 shadow-[0_15px_30px_-5px_rgba(37,99,235,0.3)]" 
          : "bg-white/5 border-white/5 grayscale hover:grayscale-0 hover:bg-white/10"
      }`}
    >
      <div className={`${active ? "text-white" : "text-blue-400"}`}>
        {icon}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${active ? "text-white" : "text-white/60"}`}>{title}</span>
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
