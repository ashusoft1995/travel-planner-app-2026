"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiCheck, FiX, FiShield, FiUser } from "react-icons/fi";
import { getApiUrl, authHeaders, friendlyApiMessage } from "../../../lib/api";

export default function AgentsPanel() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch(getApiUrl("/users"), { headers: authHeaders() });
      if (!res.ok) throw new Error("Failed to load users");
      const data = await res.json();
      // Filter only agents for this panel
      setAgents((data.users || []).filter(u => u.role === "agent"));
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(getApiUrl(`/users/${id}/status`), {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success(`Agent marked as ${status}`);
      fetchUsers();
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    }
  };

  if (loading) {
    return <div className="text-sm text-[var(--muted)]">Loading agents...</div>;
  }

  if (agents.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-400">
        No travel agents found.
      </div>
    );
  }

  const pending = agents.filter(a => a.status === "pending");
  const active = agents.filter(a => a.status === "active");

  return (
    <div className="space-y-10">
      <div>
        <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-white">
          <FiShield className="text-accent-yellow" /> Pending Approvals ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-sm text-slate-400">No agents are waiting for approval.</p>
        ) : (
          <div className="grid gap-4">
            {pending.map((a) => (
              <div key={a.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-accent-yellow/20 bg-accent-yellow/5 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-yellow/20 text-accent-yellow">
                    <FiUser />
                  </div>
                  <div>
                    <p className="font-bold text-white">{a.name} <span className="text-xs font-normal text-slate-400">@{a.username}</span></p>
                    <p className="text-xs text-slate-300">{a.email}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(a.id, "active")} className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400 hover:bg-emerald-500/30">
                    <FiCheck /> Approve
                  </button>
                  <button onClick={() => updateStatus(a.id, "rejected")} className="flex items-center gap-1 rounded-lg bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/30">
                    <FiX /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
         <h2 className="mb-4 text-xl font-bold flex items-center gap-2 text-white">
          Active Agents ({active.length})
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
           {active.map((a) => (
             <div key={a.id} className="rounded-xl border border-white/10 bg-white/5 p-4 flex justify-between items-center">
                 <div>
                    <p className="font-bold text-white">{a.name}</p>
                    <p className="text-xs text-slate-400">{a.email}</p>
                 </div>
                 <button onClick={() => updateStatus(a.id, "pending")} className="text-xs text-red-400 hover:underline">
                    Revoke Access
                 </button>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
