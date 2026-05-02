"use client";

import { useCallback, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { 
  FiSend, 
  FiMail, 
  FiMessageCircle, 
  FiInbox, 
  FiClock, 
  FiUser, 
  FiChevronDown, 
  FiChevronUp,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw
} from "react-icons/fi";
import { fetchAdminContactMessages, postAdminContactReply, friendlyApiMessage } from "../../../../lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminInboxPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" /></div>}>
      <AdminInboxContent />
    </Suspense>
  );
}

function AdminInboxContent() {
  const [contacts, setContacts] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const searchParams = useSearchParams();

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchAdminContactMessages();
      const list = Array.isArray(data) ? data : [];
      setContacts(list);
      // Auto-expand if messageId param is present
      const msgId = searchParams.get("messageId");
      if (msgId) {
        setExpandedId(msgId);
      }
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const setReplyInput = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const sendContactReply = async (id) => {
    const body = String(replyInputs[id] || "").trim();
    if (!body) {
      toast.error("Enter a reply transmission");
      return;
    }
    try {
      const { data } = await postAdminContactReply(id, body);
      setContacts((prev) => prev.map((c) => (c.id === id ? data : c)));
      setReplyInput(id, "");
      toast.success("✅ Reply dispatched — traveler notified!");
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const stats = {
    total: contacts.length,
    replied: contacts.filter(c => c.status === 'replied' || c.reply_text).length,
    pending: contacts.filter(c => c.status !== 'replied' && !c.reply_text).length
  };

  if (loading && contacts.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg shadow-purple-500/20" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-white/30">Scanning Support Frequencies...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
            <FiInbox className="text-purple-500" />
            Support <span className="text-purple-400">Intelligence</span>
          </h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Global traveler inquiry management</p>
        </div>
        <button 
          onClick={loadContacts}
          className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white hover:bg-purple-600 transition shadow-lg"
        >
          <FiRefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: "Total Manifests", val: stats.total, icon: FiInbox, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Resolved Nodes", val: stats.replied, icon: FiCheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Awaiting Action", val: stats.pending, icon: FiAlertCircle, color: "text-amber-400", bg: "bg-amber-500/10" },
        ].map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-[2rem] bg-[#12122a] border border-white/10 relative overflow-hidden group hover:border-purple-500/30 transition-all"
          >
             <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${s.bg} ${s.color} ring-1 ring-white/10 shadow-lg`}>
                   <s.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-black text-white">{s.val}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/30">{s.label}</p>
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      {/* ── EMPTY STATE ── */}
      {contacts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 bg-white/[0.02] py-32 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-purple-500/10 text-purple-400 shadow-2xl ring-1 ring-purple-500/20 mb-8">
            <FiMail size={32} />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Encryption Clear</h3>
          <p className="mt-2 text-xs text-white/30 uppercase font-bold tracking-widest">No active support inquiries detected in current cycle</p>
        </div>
      )}

      {/* ── MESSAGES GRID ── */}
      <div className="grid gap-6">
        {contacts.map((c, i) => {
          const isReplied = c.status === 'replied' || c.reply_text;
          const isExpanded = expandedId === c.id;
          
          return (
            <motion.article
              key={c.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group overflow-hidden rounded-[2.5rem] border transition-all duration-500 ${
                isExpanded ? "border-purple-500/30 bg-[#151535] shadow-2xl" : "border-white/10 bg-[#12122a] hover:border-white/20"
              }`}
            >
              {/* Card Header (Summary) */}
              <div
                className="flex cursor-pointer items-start justify-between gap-6 p-8"
                onClick={() => setExpandedId(isExpanded ? null : c.id)}
              >
                <div className="flex items-start gap-6">
                  <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-purple-500 to-indigo-600 text-xl font-black text-white shadow-xl group-hover:scale-105 transition-transform ${isReplied ? 'opacity-50' : ''}`}>
                    {(c.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h3 className="text-lg font-black text-white tracking-tight uppercase">{c.subject || "Security Inquiry"}</h3>
                      <span className={`rounded-lg px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] border ${
                        isReplied 
                          ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                          : "bg-amber-500/10 border-amber-500/20 text-amber-400 animate-pulse"
                      }`}>
                        {isReplied ? "REPLY DISPATCHED" : "AWAITING RESPONSE"}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-[10px] text-white/40 font-bold uppercase tracking-widest">
                      <span className="flex items-center gap-1.5"><FiUser size={12} className="text-purple-400" /> {c.name}</span>
                      <span className="flex items-center gap-1.5"><FiMail size={12} className="text-blue-400" /> {c.email}</span>
                      {c.createdAt && <span className="flex items-center gap-1.5"><FiClock size={12} className="text-white/20" /> {new Date(c.createdAt).toLocaleString()}</span>}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 pt-2">
                  <div className={`p-2 rounded-xl bg-white/5 text-white/30 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`}>
                    <FiChevronDown size={20} />
                  </div>
                </div>
              </div>

              {/* Expanded Content (Message & Reply UI) */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-white/5 p-8 pt-2 space-y-8">
                      {/* Original Message */}
                      <div className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-purple-500/20 rounded-full" />
                        <div className="pl-6 py-2">
                          <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-3">Transmission Origin</p>
                          <div className="rounded-[1.5rem] bg-white/[0.03] border border-white/5 p-6 text-[13px] text-slate-300 leading-relaxed shadow-inner">
                            {c.message}
                          </div>
                        </div>
                      </div>

                      {/* Reply Logic */}
                      {isReplied ? (
                        <div className="relative">
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500/20 rounded-full" />
                          <div className="pl-6 py-2">
                            <p className="text-[10px] font-black text-emerald-400/40 uppercase tracking-widest mb-3">Counter-Transmission (Your Reply)</p>
                            <div className="rounded-[1.5rem] bg-emerald-500/[0.03] border border-emerald-500/20 p-6 text-[13px] text-emerald-100 leading-relaxed shadow-inner">
                              {c.reply_text}
                              <div className="mt-4 flex items-center gap-3 text-[9px] font-black uppercase text-emerald-400/30 tracking-widest border-t border-emerald-500/10 pt-3">
                                <span>Dispatcher: {c.replied_by || "ADMIN"}</span>
                                <span>•</span>
                                <span>Cycle: {c.replied_at ? new Date(c.replied_at).toLocaleString() : "SYNCED"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400 ml-1">Draft Response Protocol</label>
                          <div className="relative group">
                            <textarea
                              rows={4}
                              className="w-full rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 text-sm text-white placeholder:text-white/20 outline-none focus:border-purple-500/50 resize-none transition-all"
                              placeholder="Formulate official traveler guidance..."
                              value={replyInputs[c.id] || ""}
                              onChange={(e) => setReplyInput(c.id, e.target.value)}
                            />
                            <div className="absolute bottom-4 right-4">
                               <button
                                onClick={() => sendContactReply(c.id)}
                                className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-2xl shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all"
                              >
                                <FiSend size={14} /> Execute Dispatch
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
