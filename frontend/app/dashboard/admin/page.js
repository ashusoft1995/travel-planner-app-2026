"use client";

import { useState, useEffect } from "react";
import { fetchAdminContactMessages } from "../../../lib/api";
import { FiMail, FiUser, FiClock } from "react-icons/fi";

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminContactMessages()
      .then(res => {
        setMessages(res.data?.data || []);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
      <div className="mb-8 border-b border-white/10 pb-6">
        <p className="text-xs font-black text-accent-yellow uppercase tracking-widest mb-2">Command Center</p>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">
          Admin Dashboard
        </h1>
      </div>

      <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-lg font-black text-white uppercase tracking-widest flex items-center gap-3">
            <FiMail className="text-accent-yellow" /> Inbox
          </h2>
        </div>
        
        {loading ? (
          <div className="p-12 text-center text-white/50 animate-pulse font-black uppercase tracking-widest text-xs">
            Loading Transmissions...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-white/30 font-black uppercase tracking-widest text-xs">
            No active transmissions
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {messages.map(msg => (
              <div key={msg.id} className="p-6 hover:bg-white/5 transition-colors">
                <div className="flex flex-col md:flex-row gap-4 justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-black uppercase tracking-widest text-accent-yellow border border-accent-yellow/30 px-2 py-0.5 rounded-md">
                        {msg.subject || "General Inquiry"}
                      </span>
                      {msg.admin_target && (
                        <span className="text-[10px] font-black uppercase tracking-widest bg-blue-600 text-white px-2 py-0.5 rounded-md">
                          Target: {msg.admin_target}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2">{msg.name}</h3>
                    <p className="text-sm font-bold text-white/50">{msg.email}</p>
                  </div>
                  <span className="text-[10px] font-black text-white/30 uppercase tracking-widest whitespace-nowrap">
                    <FiClock className="inline mr-1" />
                    {new Date(msg.created_at || msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="bg-[#051128] rounded-2xl p-4 border border-white/10 mt-4">
                  <p className="text-white/80 leading-relaxed text-sm whitespace-pre-wrap">{msg.message}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
