"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiPlus, 
  FiTrash2, 
  FiAlertTriangle, 
  FiInfo, 
  FiCheckCircle, 
  FiImage, 
  FiClock, 
  FiEye,
  FiRefreshCw,
  FiX
} from "react-icons/fi";
import { fetchAnnouncements, postAnnouncement, deleteAnnouncement, friendlyApiMessage } from "../../../../lib/api";
import toast from "react-hot-toast";

export default function ProtocolBulletins() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    body: "",
    type: "info",
    image: ""
  });

  const load = async () => {
    setLoading(true);
    try {
      const { data: res } = await fetchAnnouncements(); 
      // Handle response structure { success: true, data: [...] }
      const rawItems = Array.isArray(res.data) ? res.data : [];
      const mapped = rawItems.map(item => ({
        ...item,
        createdAt: item.created_at || item.createdAt
      }));
      setItems(mapped);
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await postAnnouncement(formData);
      toast.success("Bulletin published to Home Page");
      setFormData({ title: "", body: "", type: "info", image: "" });
      setShowAdd(false);
      load();
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemove = async (id) => {
    if (!confirm("Remove this bulletin? It will vanish from the Home Page.")) return;
    try {
      await deleteAnnouncement(id);
      setItems(prev => prev.filter(i => i.id !== id));
      toast.success("Bulletin removed");
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    }
  };

  const TYPE_CONFIG = {
    info: { icon: FiInfo, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    warning: { icon: FiAlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    success: { icon: FiCheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">Global Transmissions</h2>
          <p className="text-xs text-white/40 italic">Manage public alerts and breaking news on the home page</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={load}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-orange-500/20 hover:scale-[1.02] transition-transform"
          >
            <FiPlus /> New Bulletin
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-[2rem] border border-white/10 bg-[#0d0d1a]/95 p-8 shadow-2xl"
            >
              <button 
                onClick={() => setShowAdd(false)}
                className="absolute right-6 top-6 text-white/40 hover:text-white"
              >
                <FiX size={24} />
              </button>

              <div className="mb-6">
                <h3 className="text-2xl font-black text-white">Initialize Bulletin</h3>
                <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Public Transmission Logic</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Bulletin Title</label>
                  <input 
                    required
                    type="text"
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Lalibela Weather Warning"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white focus:border-amber-500/50 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Transmission Type</label>
                    <select 
                      value={formData.type}
                      onChange={e => setFormData({ ...formData, type: e.target.value })}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white focus:border-amber-500/50 outline-none appearance-none"
                    >
                      <option value="info" className="bg-[#1a1a2e]">Informational</option>
                      <option value="warning" className="bg-[#1a1a2e]">Warning / Urgent</option>
                      <option value="success" className="bg-[#1a1a2e]">Promotion / Good News</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Featured Image URL</label>
                    <input 
                      type="text"
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash..."
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white focus:border-amber-500/50 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Transmission Body</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.body}
                    onChange={e => setFormData({ ...formData, body: e.target.value })}
                    placeholder="Provide full details of the broadcast..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white focus:border-amber-500/50 outline-none transition resize-none"
                  />
                </div>

                <button 
                  disabled={submitting}
                  className="w-full rounded-xl bg-amber-500 py-3.5 text-sm font-black uppercase tracking-widest text-white shadow-xl shadow-amber-500/20 hover:bg-amber-400 disabled:opacity-50 transition"
                >
                  {submitting ? "Broadcasting..." : "Dispatch Bulletin"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading && items.length === 0 ? (
          <div className="py-20 text-center col-span-full">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center col-span-full border border-dashed border-white/10 rounded-3xl bg-white/5">
            <FiInfo size={32} className="mx-auto text-white/20 mb-4" />
            <p className="text-white/40">No active bulletins currently on Home Page</p>
          </div>
        ) : (
          items.map((item) => {
            const config = TYPE_CONFIG[item.type] || TYPE_CONFIG.info;
            return (
              <motion.div 
                layout
                key={item.id}
                className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-[#12122a] shadow-lg transition hover:border-white/20"
              >
                {item.image && (
                  <div className="relative h-32 overflow-hidden">
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12122a] to-transparent" />
                  </div>
                )}
                <div className="p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-widest ${config.border} ${config.bg} ${config.color}`}>
                      <config.icon size={10} /> {item.type}
                    </span>
                    <button 
                      onClick={() => handleRemove(item.id)}
                      className="text-white/20 hover:text-red-500 transition"
                      title="Delete transmission"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-white/40 line-clamp-3 leading-relaxed mb-4">{item.body}</p>
                  
                  <div className="mt-auto flex items-center gap-2 border-t border-white/5 pt-4 text-[10px] font-bold text-white/20 uppercase tracking-wider">
                    <FiClock size={12} />
                    <span>Transmitted: {new Date(item.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
