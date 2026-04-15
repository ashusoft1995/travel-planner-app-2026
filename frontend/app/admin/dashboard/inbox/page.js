"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiSend, FiMail, FiMessageCircle, FiInbox, FiClock, FiUser } from "react-icons/fi";
import { fetchAdminContactMessages, postAdminContactReply, friendlyApiMessage } from "../../../../lib/api";
import { motion } from "framer-motion";

export default function AdminInboxPage() {
  const [contacts, setContacts] = useState([]);
  const [replyInputs, setReplyInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await fetchAdminContactMessages();
      setContacts(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  const setReplyInput = (id, value) => {
    setReplyInputs((prev) => ({ ...prev, [id]: value }));
  };

  const sendContactReply = async (id) => {
    const body = String(replyInputs[id] || "").trim();
    if (!body) {
      toast.error("Enter a reply");
      return;
    }
    try {
      const { data } = await postAdminContactReply(id, body);
      setContacts((prev) => prev.map((c) => (c.id === id ? data : c)));
      setReplyInput(id, "");
      toast.success("✅ Reply sent — traveler notified!");
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          <p className="mt-4 text-sm text-white/50">Loading messages…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-700/10 border border-purple-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <FiInbox size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{contacts.length}</p>
              <p className="text-xs text-white/50">Total Messages</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-700/10 border border-blue-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
              <FiMessageCircle size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {contacts.filter(c => Array.isArray(c.replies) && c.replies.length > 0).length}
              </p>
              <p className="text-xs text-white/50">Replied</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/20 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <FiMail size={18} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                {contacts.filter(c => !c.replies || c.replies.length === 0).length}
              </p>
              <p className="text-xs text-white/50">Awaiting Reply</p>
            </div>
          </div>
        </div>
      </div>

      {contacts.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/5 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
            <FiInbox size={28} />
          </div>
          <p className="mt-4 font-semibold text-white">No messages yet</p>
          <p className="mt-1 text-sm text-white/40">When travelers contact you, messages will appear here.</p>
        </div>
      )}

      {contacts.map((c, i) => (
        <motion.article
          key={c.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          className="overflow-hidden rounded-2xl border border-white/10 bg-[#12122a]"
        >
          {/* Card header */}
          <div
            className="flex cursor-pointer items-start justify-between gap-4 p-5 hover:bg-white/[0.02] transition"
            onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
          >
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-lg font-bold text-white shadow">
                {(c.name || "?").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-bold text-white">{c.subject || "Support message"}</p>
                  {(!c.replies || c.replies.length === 0) && (
                    <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400">
                      Needs reply
                    </span>
                  )}
                  {c.replies?.length > 0 && (
                    <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                      Replied
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/50">
                  <span className="flex items-center gap-1"><FiUser size={11} /> {c.name}</span>
                  <span className="flex items-center gap-1"><FiMail size={11} /> {c.email}</span>
                  {c.createdAt && <span className="flex items-center gap-1"><FiClock size={11} /> {new Date(c.createdAt).toLocaleString()}</span>}
                </div>
              </div>
            </div>
            <div className="shrink-0 text-white/30 text-xs">{expandedId === c.id ? "▲ close" : "▼ open"}</div>
          </div>

          {expandedId === c.id && (
            <div className="border-t border-white/10 p-5 space-y-4">
              {/* Message body */}
              <div className="rounded-xl bg-white/5 p-4 text-sm text-white/80 leading-relaxed">
                {c.message}
              </div>

              {/* Thread replies */}
              {Array.isArray(c.replies) && c.replies.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40">Thread</p>
                  {c.replies.map((r) => (
                    <div
                      key={r.id}
                      className={`rounded-xl p-3 text-sm ${
                        r.from === "admin"
                          ? "ml-6 border border-purple-500/30 bg-purple-500/10"
                          : "border border-white/10 bg-white/5"
                      }`}
                    >
                      <p className="text-xs font-bold text-purple-400">
                        {r.from === "admin" ? "🛡 Admin" : "👤 User"} · {r.authorName || ""} · {r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}
                      </p>
                      <p className="mt-1 text-white/80">{r.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply box */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-white/40">
                  Your reply
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-purple-500/50 resize-none"
                  placeholder="Type your reply to the traveler…"
                  value={replyInputs[c.id] || ""}
                  onChange={(e) => setReplyInput(c.id, e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => sendContactReply(c.id)}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 hover:shadow-purple-500/30 hover:shadow-xl"
                >
                  <FiSend size={14} /> Send Reply & Notify User
                </button>
              </div>
            </div>
          )}
        </motion.article>
      ))}
    </div>
  );
}
