"use client";

import { useState, useEffect } from "react";
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiMapPin, 
  FiImage, 
  FiSave, 
  FiX, 
  FiStar, 
  FiDollarSign,
  FiActivity,
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { tripsApi, friendlyApiMessage, getApiUrl } from "../../lib/api";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function DestinationManager() {
  const { user, token } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingDestination, setEditingDestination] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    region: "",
    description: "",
    highlights: [],
    imageUrl: "",
    hotels: {},
    activities: {},
    travel_volume_index: 0,
    price: "",
    rating: 4.5
  });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const response = await tripsApi.get("/destinations");
      setDestinations(response.data?.data || []);
    } catch (error) {
      toast.error(friendlyApiMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading(editingDestination ? "Updating node..." : "Initializing new destination...");
    
    try {
      const payload = { ...formData };
      let response;
      
      if (editingDestination) {
        response = await tripsApi.put(`/destinations/${editingDestination.id}`, payload);
      } else {
        response = await tripsApi.post("/destinations", payload);
      }
      
      if (response.data?.success) {
        toast.success(`Destination ${editingDestination ? "synchronized" : "deployed"} successfully`, { id: loadingToast });
        setShowForm(false);
        setEditingDestination(null);
        resetForm();
        fetchDestinations();
      }
    } catch (error) {
      toast.error(friendlyApiMessage(error), { id: loadingToast });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to purge this destination from the global registry?")) return;
    
    try {
      const response = await tripsApi.delete(`/destinations/${id}`);
      if (response.data?.success) {
        toast.success("Destination purged from registry");
        fetchDestinations();
      }
    } catch (error) {
      toast.error(friendlyApiMessage(error));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      country: "",
      region: "",
      description: "",
      highlights: [],
      imageUrl: "",
      hotels: {},
      activities: {},
      travel_volume_index: 0,
      price: "",
      rating: 4.5
    });
  };

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setFormData({
      ...destination,
      highlights: destination.highlights || [],
      hotels: destination.hotels || {},
      activities: destination.activities || {},
      travel_volume_index: destination.travel_volume_index || 0,
      price: destination.price || "",
      rating: destination.rating || 4.5
    });
    setShowForm(true);
  };

  const addHighlight = () => {
    setFormData(prev => ({
      ...prev,
      highlights: [...prev.highlights, ""]
    }));
  };

  const updateHighlight = (index, value) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.map((h, i) => i === index ? value : h)
    }));
  };

  const removeHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }));
  };

  const filtered = destinations.filter(d => 
    d.name?.toLowerCase().includes(search.toLowerCase()) ||
    d.country?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading && destinations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent shadow-lg" />
        <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Scanning Global Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white flex items-center gap-2">
            <FiMapPin className="text-purple-500" />
            Destination <span className="text-purple-400">Registry</span>
          </h2>
          <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest mt-1">Global Node Management System</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
             <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
             <input 
               type="text" 
               placeholder="Search nodes..." 
               value={search}
               onChange={e => setSearch(e.target.value)}
               className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-white/20 outline-none focus:border-purple-500/50 transition-all"
             />
          </div>
          <button
            onClick={() => {
              setEditingDestination(null);
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-purple-600/20 hover:scale-105 transition active:scale-95 whitespace-nowrap"
          >
            <FiPlus /> Initialize Node
          </button>
        </div>
      </div>

      {/* ── SLIDER ── */}
      <div className="relative group/slider">
        <div className="flex gap-6 overflow-x-hidden pb-4 transition-all duration-500 scroll-smooth">
          <AnimatePresence mode="wait">
            {filtered.slice(currentIndex, currentIndex + 3).map((dest, i) => (
              <motion.div 
                key={dest.id}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ delay: i * 0.1 }}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#12122a] shadow-xl transition hover:border-purple-500/30"
              >
                <div className="aspect-video relative overflow-hidden bg-white/5">
                  {dest.imageUrl ? (
                    <img
                      src={dest.imageUrl}
                      alt={dest.name}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FiImage size={32} className="text-white/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12122a] via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                    <button
                      onClick={() => handleEdit(dest)}
                      className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-purple-600 transition shadow-xl"
                    >
                      <FiEdit2 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(dest.id)}
                      className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-red-600 transition shadow-xl"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4">
                     <span className="text-[9px] font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 px-2 py-1 rounded-lg backdrop-blur-sm border border-purple-500/20">
                        {dest.price || "NO PRICE"}
                     </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{dest.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400">
                       <FiStar size={12} fill="currentColor" />
                       <span className="text-[10px] font-black">{dest.rating || dest.travel_volume_index || 0}</span>
                    </div>
                  </div>
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-3 flex items-center gap-1">
                    <FiMapPin size={10} /> {dest.region || "Central"}, {dest.country}
                  </p>
                  
                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-4 italic">
                    "{dest.description || "No transmission data available for this node."}"
                  </p>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 text-[9px] font-black uppercase tracking-widest text-white/20">
                    <span className="flex items-center gap-1"><FiActivity size={12} /> {Object.keys(dest.hotels || {}).length} Infra</span>
                    <span className="flex items-center gap-1"><FiDollarSign size={12} /> {Object.keys(dest.activities || {}).length} Services</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Slider Controls */}
        {filtered.length > 3 && (
          <>
            <button 
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="absolute -left-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-[#12122a] border border-white/10 text-white shadow-2xl hover:bg-purple-600 transition disabled:opacity-0 z-10"
            >
              <FiChevronLeft size={24} />
            </button>
            <button 
              onClick={() => setCurrentIndex(prev => Math.min(filtered.length - 3, prev + 1))}
              disabled={currentIndex >= filtered.length - 3}
              className="absolute -right-4 top-1/2 -translate-y-1/2 p-4 rounded-full bg-[#12122a] border border-white/10 text-white shadow-2xl hover:bg-purple-600 transition disabled:opacity-0 z-10"
            >
              <FiChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* ── ADD/EDIT MODAL ── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0d0d1a] rounded-[2.5rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10 shadow-3xl relative p-8 custom-scrollbar"
            >
              <button 
                onClick={() => { setShowForm(false); setEditingDestination(null); resetForm(); }}
                className="absolute top-8 right-8 text-white/30 hover:text-white transition"
              >
                <FiX size={24} />
              </button>

              <div className="mb-8">
                <h3 className="text-3xl font-black text-white uppercase tracking-tight">
                  {editingDestination ? "Modify Node" : "Initialize Node"}
                </h3>
                <p className="text-xs text-white/40 font-bold uppercase tracking-[0.2em] mt-1">Data Entry Protocol</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Node Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none transition"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Sovereign State</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none transition"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Standard Price (ETB)</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g. 25,000 ETB"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Node Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData(prev => ({ ...prev, rating: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Geographic Region</label>
                    <input
                      type="text"
                      value={formData.region}
                      onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Popularity Index (0-100)</label>
                    <input
                      type="number"
                      value={formData.travel_volume_index}
                      onChange={(e) => setFormData(prev => ({ ...prev, travel_volume_index: Number(e.target.value) }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Transmission Body (Description)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none transition resize-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-2 block">Satellite Visualization (Image URL)</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500/50 outline-none transition"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-[10px] font-black uppercase text-white/30 tracking-widest">Node Highlights</label>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="text-[10px] font-black uppercase text-purple-400 hover:text-purple-300 transition flex items-center gap-1"
                    >
                      <FiPlus size={12} /> Add Point
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => updateHighlight(index, e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-purple-500/50"
                          placeholder="Transmission point..."
                        />
                        <button
                          type="button"
                          onClick={() => removeHighlight(index)}
                          className="p-2 text-white/20 hover:text-red-500 transition"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-purple-600/20 hover:scale-[1.02] active:scale-95 transition"
                  >
                    <FiSave size={14} className="inline mr-2" />
                    {editingDestination ? "Commit Overrides" : "Initialize Node"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-[2rem] bg-white/[0.02]">
          <FiMapPin size={48} className="text-white/10 mb-4" />
          <h3 className="text-sm font-black text-white/40 uppercase tracking-widest">No matching nodes in registry</h3>
          <p className="text-[10px] text-white/20 uppercase font-bold mt-2">Adjust your parameters or initialize a new node.</p>
        </div>
      )}
    </div>
  );
}
