"use client";

import { use, useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCalendar, FiMapPin, FiDollarSign, FiClock, FiPlus, FiTrash2, FiShare2 } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from "recharts";
import toast from "react-hot-toast";

import RequireAuth from "../../../components/RequireAuth";
import { useAuth } from "../../../context/AuthContext";
import { useTrips } from "../../../context/TripContext";
import { api, friendlyApiMessage } from "../../../lib/api";

const PIE_COLORS = ["#1f5bb5", "#2aa65a", "#f4c430", "#8b5cf6", "#f43f5e", "#06b6d4"];

function SingleTripContent({ params }) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const tripId = unwrappedParams?.id;
  const { trips, fetchTrips, token, updateTrip } = useTrips();
  const { user } = useAuth();
  
  const [trip, setTrip] = useState(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [loading, setLoading] = useState(true);

  // Load trip from context or fetch
  useEffect(() => {
    if (!tripId || trips.length === 0) return;
    const found = trips.find(t => t.id === tripId);
    if (found) {
      setTrip(found);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [tripId, trips]);

  const handleUpdate = async (patch) => {
    try {
      await updateTrip(trip.id, patch);
      toast.success("Saved dynamically");
      setTrip(prev => ({...prev, ...patch}));
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  // Derived budget info
  const expenses = trip?.expenses || [];
  const totalBudget = Number(trip?.budget || 0);
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const budgetRemaining = totalBudget - totalSpent;

  // Pie chart data
  const pieData = useMemo(() => {
    const byCat = {};
    expenses.forEach(e => {
      const c = e.category || "Other";
      byCat[c] = (byCat[c] || 0) + Number(e.amount || 0);
    });
    return Object.entries(byCat).map(([name, value]) => ({ name, value }));
  }, [expenses]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="page-shell py-12 container text-center">
        <h1 className="text-2xl font-bold">Trip not found</h1>
        <p className="mt-4 text-[var(--muted)]">You may not have access or it was deleted.</p>
        <Link href="/trips" className="mt-6 inline-block btn-primary">Go back</Link>
      </div>
    );
  }

  const TABS = [
    { id: "itinerary", label: "Itinerary" },
    { id: "budget", label: "Budget tracker" },
    { id: "overview", label: "Overview details" },
    { id: "map", label: "Map & Weather" },
    { id: "documents", label: "Documents" }
  ];

  return (
    <div className="page-shell py-8">
      <div className="container max-w-5xl">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)] transition">
          <FiArrowLeft /> Back
        </button>

        {/* Custom Header styling with cover image fade-in */}
        <div className="relative h-64 md:h-80 w-full overflow-hidden animate-fade-in card-surface group mb-8 relative border-0">
          <div className="h-48 md:h-64 w-full relative">
            {trip.image ? (
              <img src={trip.image} className="w-full h-full object-cover" alt="" />
            ) : (
              <div className="w-full h-full bg-brand-900 flex items-center justify-center">
                <FiMapPin size={48} className="text-brand-500/30" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
              <div>
                <span className="inline-block px-2 py-1 mb-2 text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur rounded flex items-center gap-1 w-fit">
                  <FiCalendar /> {trip.startDate} — {trip.endDate}
                </span>
                <h1 className="text-3xl md:text-5xl font-bold">{trip.destination}</h1>
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 p-2 hover:bg-[var(--border)] rounded-lg w-full text-left transition" onClick={() => window.print()}>
                <FiMapPin /> Print Itinerary
              </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-[var(--border)] mb-8 gap-6">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`pb-3 text-sm font-bold border-b-2 transition ${activeTab === t.id ? "border-brand-600 text-brand-600 dark:border-accent-yellow dark:text-accent-yellow" : "border-transparent text-[var(--muted)] hover:text-[var(--text)]"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab Content Panels */}
        <div className="min-h-[400px] animate-fade-in stagger-2">
          {activeTab === "itinerary" && (
            <ItineraryTab trip={trip} onUpdate={handleUpdate} />
          )}

          {activeTab === "budget" && (
            <BudgetTab trip={trip} onUpdate={handleUpdate} pieData={pieData} totalBudget={totalBudget} totalSpent={totalSpent} budgetRemaining={budgetRemaining} />
          )}

          {activeTab === "overview" && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="card-surface p-6">
                <h3 className="text-lg font-bold mb-4">Trip Info</h3>
                <ul className="space-y-4">
                  <li>
                    <span className="block text-xs uppercase text-[var(--muted)] font-bold">Accommodation</span>
                    <span className="font-medium">{trip.accommodation || "Not set"}</span>
                  </li>
                  <li>
                    <span className="block text-xs uppercase text-[var(--muted)] font-bold">Notes</span>
                    <p className="whitespace-pre-wrap mt-1 text-sm">{trip.notes || "No notes added."}</p>
                  </li>
                  <li>
                    <span className="block text-xs uppercase text-[var(--muted)] font-bold">Status</span>
                    <span className="inline-block mt-1 px-3 py-1 bg-[var(--border)] rounded-full text-xs font-bold">{trip.approvalStatus}</span>
                  </li>
                </ul>
              </div>
              <div className="card-surface p-6">
                <h3 className="text-lg font-bold mb-4">Actions</h3>
                <Link href={`/add-trip?edit=${trip.id}`} className="w-full text-left p-3 rounded-xl border border-[var(--border)] hover:border-brand-500 font-semibold text-sm transition mb-3 block text-center">
                  Edit trip settings
                </Link>
                <div className="p-4 bg-brand-500/10 dark:bg-brand-500/5 rounded-xl border border-brand-500/20 text-brand-900 dark:text-brand-100 flex items-center justify-between mt-6">
                  <div>
                    <p className="font-bold text-sm">Countdown</p>
                    <p className="text-xs opacity-80">Days until you leave</p>
                  </div>
                  <div className="text-2xl font-bold bg-white dark:bg-brand-950 px-3 py-1 rounded shadow-sm">
                    {Math.max(0, Math.floor((new Date(trip.startDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "map" && (
            <MapWeatherTab trip={trip} />
          )}

          {activeTab === "documents" && (
            <DocumentsTab trip={trip} onUpdate={handleUpdate} />
          )}
        </div>
        
      </div>
    </div>
  );
}

// ------ Subcomponents for Tabs ------

function ItineraryTab({ trip, onUpdate }) {
  const days = trip?.itinerary || [];
  
  const addDay = () => {
    const newDay = { date: "Day " + (days.length + 1), activities: [] };
    onUpdate({ itinerary: [...days, newDay] });
  };
  
  const addActivity = (dayIndex) => {
    const title = prompt("Activity name:");
    if (!title) return;
    const time = prompt("Time (e.g. 10:00 AM):") || "12:00 PM";
    
    const newDays = [...days];
    newDays[dayIndex].activities.push({ title, time, notes: "" });
    onUpdate({ itinerary: newDays });
  };

  if (days.length === 0) {
    return (
      <div className="card-surface border-dashed p-12 text-center text-[var(--muted)]">
        <FiClock size={32} className="mx-auto mb-3 opacity-50" />
        <p className="font-bold text-[var(--text)]">Your itinerary is empty</p>
        <p className="text-sm mt-1 mb-6">Plan day-by-day activities and timeslots.</p>
        <button className="btn-primary py-2 px-4 shadow-none" onClick={addDay}>
          + Add Day 1 Plan
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button className="btn-secondary py-1.5 px-4 text-sm inline-flex items-center gap-2" onClick={addDay}>
          <FiPlus /> Add Next Day
        </button>
      </div>
      {days.map((day, idx) => (
        <div key={idx} className="card-surface p-6 flex flex-col md:flex-row gap-6 hover:border-brand-500/30 transition border border-[var(--border)]">
          <div className="md:w-1/4 md:border-r border-[var(--border)] pr-4">
            <p className="text-brand-600 dark:text-accent-yellow font-bold uppercase tracking-wider text-xs mb-1">Day {idx + 1}</p>
            <input 
              type="text" 
              className="bg-transparent text-lg font-bold outline-none border-b border-transparent hover:border-[var(--border)] focus:border-brand-500 w-full mb-4" 
              defaultValue={day.date} 
              onBlur={(e) => {
                const newDays = [...days];
                newDays[idx].date = e.target.value;
                onUpdate({ itinerary: newDays });
              }}
            />
            <button className="btn-secondary text-xs py-1 px-3 mt-2 w-full flex justify-center items-center gap-1" onClick={() => addActivity(idx)}>
              <FiPlus /> Add Activity
            </button>
          </div>
          <div className="md:w-3/4 flex flex-col gap-4">
            {(day.activities || []).length === 0 && <p className="text-[var(--muted)] text-sm italic">No activities planned yet.</p>}
            {(day.activities || []).map((act, i) => (
              <div key={i} className="flex gap-4 p-3 rounded-lg bg-[var(--bg)] border border-[var(--border)] group relative">
                 <button className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1 rounded transition"
                  onClick={() => {
                    const newDays = [...days];
                    newDays[idx].activities.splice(i, 1);
                    onUpdate({ itinerary: newDays });
                  }}
                 ><FiTrash2 size={14}/></button>
                <span className="font-mono text-sm font-bold text-[var(--muted)] mt-0.5">{act.time}</span>
                <div>
                  <p className="font-semibold">{act.title}</p>
                  {act.notes && <p className="text-sm text-[var(--muted)] mt-1">{act.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}function BudgetTab({ trip, onUpdate, pieData, totalBudget, totalSpent, budgetRemaining }) {
  const overBudget = budgetRemaining < 0;
  
  const addExpense = () => {
    const name = prompt("Expense name (e.g., Flight):");
    if (!name) return;
    const amountStr = prompt("Amount:");
    const amount = Number(amountStr);
    if (!amount) return;
    const category = prompt("Category (e.g., Transport, Food, Hotel):") || "Other";
    
    const newExpenses = [...(trip.expenses || []), { name, amount, category }];
    onUpdate({ expenses: newExpenses });
  };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card-surface p-6 col-span-1 flex flex-col justify-center">
          <p className="text-sm font-bold text-[var(--muted)] mb-1 uppercase tracking-wide">Total Budget</p>
          <p className="text-3xl font-bold">${totalBudget.toLocaleString()}</p>
          
          <div className="mt-6">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium">Total Spent</span>
              <span className="font-bold">${totalSpent.toLocaleString()}</span>
            </div>
            <div className="w-full bg-[var(--border)] h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${overBudget ? 'bg-red-500' : 'bg-brand-500'}`} 
                style={{ width: `${Math.min(100, (totalSpent / (totalBudget || 1)) * 100)}%` }}
              />
            </div>
            <p className={`text-xs mt-2 font-bold ${overBudget ? 'text-red-500' : 'text-emerald-500'}`}>
              {overBudget ? 'Over budget by' : 'Remaining'}: ${Math.abs(budgetRemaining).toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="card-surface p-6 col-span-1 md:col-span-2 flex items-center justify-center h-[280px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2}>
                  {pieData.map((e, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(val) => `$${val}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-[var(--muted)]">No expenses added yet.</p>
          )}
        </div>
      </div>

      <div className="card-surface p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Logged Expenses</h3>
          <button className="btn-primary py-1.5 px-4 text-sm" onClick={addExpense}>
            + Log Expense
          </button>
        </div>
        
        {(!trip?.expenses || trip.expenses.length === 0) ? (
          <p className="text-center py-6 text-[var(--muted)] text-sm">Start tracking what you spend to see visual breakdowns.</p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {trip.expenses.map((e, i) => (
              <li key={i} className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <button className="text-red-500 hover:bg-red-500/10 p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    onClick={() => {
                      const newExp = [...trip.expenses];
                      newExp.splice(i, 1);
                      onUpdate({ expenses: newExp });
                    }}
                  ><FiTrash2 size={16}/></button>
                  <div>
                    <p className="font-bold">{e.name}</p>
                    <span className="text-xs uppercase font-bold text-brand-600 bg-brand-500/10 px-2 py-0.5 rounded-full">{e.category}</span>
                  </div>
                </div>
                <p className="font-bold text-lg">${Number(e.amount).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function MapWeatherTab({ trip }) {
  // Use OSM iframe for simple integration of Map View
  const mapUrl = `https://nominatim.openstreetmap.org/ui/search.html?q=${encodeURIComponent(trip.destination)}`;

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="card-surface p-6 col-span-1 md:col-span-2 shadow-sm flex flex-col">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <FiMapPin className="text-brand-500" /> Interactive Map
        </h3>
        <p className="text-sm text-[var(--muted)] mb-4">Explore {trip.destination} and nearby attractions.</p>
        <div className="w-full grow min-h-[400px] rounded-xl overflow-hidden bg-[var(--border)] relative">
          <iframe 
            src={`https://nominatim.openstreetmap.org/search.php?q=${encodeURIComponent(trip.destination)}&polygon_geojson=1&format=jsonv2`} 
            width="100%" 
            height="100%" 
            title="Map view proxy" 
            className="w-full h-full opacity-60 absolute" 
            style={{ pointerEvents: 'none' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <a href={mapUrl} target="_blank" rel="noreferrer" className="btn-primary shadow-2xl">
              Open Full Map Navigation
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6 col-span-1">
        <div className="card-surface p-6">
          <h3 className="text-lg font-bold mb-2">Weather Forecast</h3>
          <p className="text-sm text-[var(--muted)] mb-4">Expected conditions for {trip.startDate}</p>
          <div className="flex items-center gap-4 bg-[var(--bg)] border border-[var(--border)] rounded-xl p-4 animate-fade-in stagger-1">
            <div className="text-4xl">☀️</div>
            <div>
              <p className="text-2xl font-bold text-[var(--text)]">24°C</p>
              <p className="text-sm text-brand-600 font-semibold dark:text-accent-yellow">Clear & sunny</p>
            </div>
          </div>
          <div className="mt-4 text-xs text-[var(--muted)] space-y-2">
            <p><strong>Best Time to Visit:</strong> Spring (March - May) and Autumn (September - November) for mild temperatures.</p>
            <p><strong>Travel Advisories:</strong> No current widespread disruptions. Practice standard safety precautions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentsTab({ trip, onUpdate }) {
  const docs = trip.documents || [];
  
  const handleUpload = () => {
    const docName = prompt("Document name (e.g., Passport Copy):");
    if (!docName) return;
    
    // Simulate File Upload
    toast.promise(
      new Promise(resolve => setTimeout(resolve, 1500)),
      {
        loading: 'Uploading document...',
        success: () => {
          const newDoc = { name: docName, type: "PDF", size: "1.2 MB", added: new Date().toLocaleDateString() };
          onUpdate({ documents: [...docs, newDoc] });
          return 'Document saved!';
        },
        error: 'Upload failed',
      }
    );
  };

  return (
    <div className="card-surface p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-bold text-lg">Travel Documents</h3>
          <p className="text-sm text-[var(--muted)]">Keep passports, booking PDFs, and tickets safe.</p>
        </div>
        <button className="btn-primary py-2 px-4 shadow-none" onClick={handleUpload}>
          + Upload File
        </button>
      </div>

      {docs.length === 0 ? (
        <div className="border-dashed border-2 border-[var(--border)] rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <FiShare2 size={32} className="text-[var(--muted)] mb-3 opacity-50" />
          <p className="font-bold text-[var(--text)]">No documents uploaded</p>
          <p className="text-sm mt-1 text-[var(--muted)]">Click upload to add flight tickets or insurance.</p>
        </div>
      ) : (
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {docs.map((d, i) => (
            <li key={i} className="border border-[var(--border)] rounded-xl p-4 flex flex-col space-y-3 bg-[var(--surface)] hover:border-brand-500/50 transition">
              <div className="flex justify-between items-start">
                <div className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-300 font-bold text-[10px] px-2 py-0.5 rounded">{d.type}</div>
                <button 
                  className="text-[var(--muted)] hover:text-red-500" 
                  onClick={() => {
                    const next = [...docs];
                    next.splice(i, 1);
                    onUpdate({ documents: next });
                  }}
                ><FiTrash2 size={16} /></button>
              </div>
              <p className="font-bold text-sm truncate" title={d.name}>{d.name}</p>
              <div className="flex justify-between text-[10px] uppercase font-bold text-[var(--muted)]">
                <span>{d.size}</span>
                <span>{d.added}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SingleTripPage(props) {
  return (
    <RequireAuth>
      <SingleTripContent params={props.params} />
    </RequireAuth>
  );
}
