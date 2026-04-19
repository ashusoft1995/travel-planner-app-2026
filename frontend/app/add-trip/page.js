"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { 
  FiArrowLeft, 
  FiArrowRight, 
  FiCheck, 
  FiDollarSign, 
  FiHome, 
  FiMapPin, 
  FiCalendar,
  FiInfo,
  FiPlus,
  FiMinus,
  FiCreditCard,
  FiPercent,
  FiSearch
} from "react-icons/fi";
import RequireAuth from "../../components/RequireAuth";
import { useTrips } from "../../context/TripContext";
import { friendlyApiMessage, searchDestinations } from "../../lib/api";
import DestinationSearchPopup from "../../components/destination/DestinationSearchPopup";
import { uploadFile } from "../../lib/supabase";

const stepLabels = ["Destination & dates", "Accommodation & Costs", "Activities & Budget", "Review & Payment"];

// Pricing data for different destinations and accommodations
const DESTINATION_PRICING = {
  "Lalibela": {
    hotels: {
      "Budget Hotel": { pricePerNight: 25, rating: 2 },
      "Mid-range Hotel": { pricePerNight: 60, rating: 3.5 },
      "Luxury Hotel": { pricePerNight: 120, rating: 4.5 },
      "Resort": { pricePerNight: 200, rating: 5 }
    },
    activities: {
      "Church Tour": { price: 15, duration: "3 hours" },
      "Rock-Hewn Churches": { price: 25, duration: "4 hours" },
      "Cultural Experience": { price: 35, duration: "Full day" },
      "Mountain Hiking": { price: 30, duration: "6 hours" },
      "Local Market Tour": { price: 10, duration: "2 hours" }
    }
  },
  "Addis Ababa": {
    hotels: {
      "Budget Hotel": { pricePerNight: 30, rating: 2.5 },
      "Mid-range Hotel": { pricePerNight: 80, rating: 4 },
      "Luxury Hotel": { pricePerNight: 150, rating: 4.5 },
      "Business Hotel": { pricePerNight: 100, rating: 4 }
    },
    activities: {
      "City Tour": { price: 20, duration: "4 hours" },
      "National Museum": { price: 10, duration: "2 hours" },
      "Mercato Market": { price: 15, duration: "3 hours" },
      "Entoto Mountain": { price: 25, duration: "Half day" },
      "Coffee Ceremony": { price: 12, duration: "2 hours" }
    }
  },
  "Simien Mountains": {
    hotels: {
      "Budget Lodge": { pricePerNight: 40, rating: 3 },
      "Mid-range Lodge": { pricePerNight: 90, rating: 4 },
      "Luxury Lodge": { pricePerNight: 180, rating: 4.5 },
      "Camping": { pricePerNight: 15, rating: 2 }
    },
    activities: {
      "Trekking": { price: 45, duration: "Full day" },
      "Wildlife Viewing": { price: 35, duration: "Half day" },
      "Mountain Climbing": { price: 55, duration: "Full day" },
      "Photography Tour": { price: 40, duration: "6 hours" },
      "Village Visit": { price: 20, duration: "3 hours" }
    }
  },
  "Bahir Dar": {
    hotels: {
      "Budget Hotel": { pricePerNight: 35, rating: 3 },
      "Mid-range Hotel": { pricePerNight: 75, rating: 4 },
      "Luxury Hotel": { pricePerNight: 140, rating: 4.5 },
      "Lakeside Resort": { pricePerNight: 160, rating: 5 }
    },
    activities: {
      "Lake Tana Cruise": { price: 30, duration: "4 hours" },
      "Blue Nile Falls": { price: 25, duration: "3 hours" },
      "Island Monasteries": { price: 40, duration: "Full day" },
      "Bird Watching": { price: 20, duration: "3 hours" },
      "Fishing Trip": { price: 35, duration: "Half day" }
    }
  }
};

function AddTripPageContent() {
  const router = useRouter();
  const { addTrip } = useTrips();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [form, setForm] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    accommodation: "",
    accommodationType: "",
    activities: [],
    notes: "",
    clientEmail: "",
  });
  const [destHits, setDestHits] = useState([]);
  const [showDestinationPopup, setShowDestinationPopup] = useState(false);
  const [allDestinations, setAllDestinations] = useState([]);
  const [costBreakdown, setCostBreakdown] = useState({
    accommodation: 0,
    activities: 0,
    meals: 0,
    transport: 0,
    subtotal: 0,
    tax: 0,
    serviceFee: 0,
    adminCommission: 0,
    agentCommission: 0,
    companyProfit: 0,
    total: 0
  });

  useEffect(() => {
    const q = form.destination.trim();
    if (q.length < 2) {
      setDestHits([]);
      return undefined;
    }
    const tid = setTimeout(async () => {
      try {
        const { data } = await searchDestinations({ q, limit: 12 });
        setDestHits(Array.isArray(data?.data) ? data.data : []);
      } catch {
        setDestHits([]);
      }
    }, 350);
    return () => clearTimeout(tid);
  }, [form.destination]);

  useEffect(() => {
    // Fetch all destinations for the popup
    const fetchAllDestinations = async () => {
      try {
        const { data } = await searchDestinations({ q: "", limit: 50 });
        setAllDestinations(Array.isArray(data?.data) ? data.data : []);
      } catch {
        setAllDestinations([]);
      }
    };
    fetchAllDestinations();
  }, []);

  useEffect(() => {
    calculateTotalCost();
  }, [form.destination, form.accommodationType, form.startDate, form.endDate, form.activities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleActivityToggle = (activityName, activityPrice) => {
    setForm(prev => {
      const existingIndex = prev.activities.findIndex(a => a.name === activityName);
      let newActivities;
      
      if (existingIndex >= 0) {
        // Remove activity
        newActivities = prev.activities.filter(a => a.name !== activityName);
      } else {
        // Add activity
        newActivities = [...prev.activities, { name: activityName, price: activityPrice }];
      }
      
      return { ...prev, activities: newActivities };
    });
  };

  const handleDestinationSelect = (destination) => {
    setForm(prev => ({ ...prev, destination: destination.name }));
    setDestHits([]);
  };

  const calculateTotalCost = () => {
    if (!form.destination || !form.accommodationType || !form.startDate || !form.endDate) {
      setCostBreakdown({
        accommodation: 0,
        activities: 0,
        meals: 0,
        transport: 0,
        subtotal: 0,
        tax: 0,
        serviceFee: 0,
        adminCommission: 0,
        agentCommission: 0,
        companyProfit: 0,
        total: 0
      });
      return;
    }

    const destinationData = DESTINATION_PRICING[form.destination];
    if (!destinationData) return;

    // Calculate duration
    const startDate = new Date(form.startDate);
    const endDate = new Date(form.endDate);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const days = nights + 1;

    // Calculate accommodation cost
    const hotelData = destinationData.hotels[form.accommodationType];
    const accommodationCost = hotelData ? hotelData.pricePerNight * nights : 0;

    // Calculate activities cost
    const activitiesCost = form.activities.reduce((sum, activity) => sum + activity.price, 0);

    // Calculate meals (estimated $25 per day)
    const mealsCost = days * 25;

    // Calculate transport (estimated $15 per day)
    const transportCost = days * 15;

    // Calculate subtotal
    const subtotal = accommodationCost + activitiesCost + mealsCost + transportCost;

    // Calculate tax (10%)
    const tax = subtotal * 0.1;

    // Calculate service fee (5%)
    const serviceFee = subtotal * 0.05;

    // Calculate commissions and profit
    const adminCommissionRate = 0.03; // 3% admin commission (1-5% range)
    const agentCommissionRate = 0.07; // 7% agent commission (5-10% range)
    
    const adminCommission = subtotal * adminCommissionRate;
    const agentCommission = subtotal * agentCommissionRate;
    const companyProfit = subtotal - adminCommission - agentCommission;

    // Calculate total (customer pays)
    const total = subtotal + tax + serviceFee;

    setCostBreakdown({
      accommodation: accommodationCost,
      activities: activitiesCost,
      meals: mealsCost,
      transport: transportCost,
      subtotal,
      tax,
      serviceFee,
      adminCommission,
      agentCommission,
      companyProfit,
      total
    });

    // Update budget field with calculated total
    setForm(prev => ({ ...prev, budget: Math.round(total) }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const toastId = toast.loading("Uploading image...");
    try {
      const url = await uploadFile(file);
      setPreviewImage(url);
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (err) {
      toast.error(err.message, { id: toastId });
    }
  };

  const validateStep = (s) => {
    if (s === 1) {
      if (!form.destination.trim()) {
        toast.error("Enter a destination");
        return false;
      }
      if (!form.startDate || !form.endDate) {
        toast.error("Choose start and end dates");
        return false;
      }
      if (new Date(form.endDate) < new Date(form.startDate)) {
        toast.error("End date must be on or after start date");
        return false;
      }
    }
    if (s === 2) {
      if (!form.accommodationType) {
        toast.error("Select accommodation type");
        return false;
      }
    }
    if (s === 3) {
      if (form.activities.length === 0) {
        toast.error("Select at least one activity");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (!validateStep(step)) return;
    setStep((c) => Math.min(c + 1, 4));
  };

  const prevStep = () => setStep((c) => Math.max(c - 1, 1));

  const calculateDuration = () => {
    if (!form.startDate || !form.endDate) return "â";
    const diff = new Date(form.endDate) - new Date(form.startDate);
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days >= 0 ? `${days + 1} day${days === 0 ? "" : "s"}` : "Invalid";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    
    const tripData = {
      destination: form.destination.trim(),
      startDate: form.startDate,
      endDate: form.endDate,
      budget: Number(form.budget) || 0,
      accommodation: form.accommodationType,
      activities: form.activities.map(a => a.name),
      notes: form.notes.trim(),
      image: previewImage || "",
      costBreakdown: {
        ...costBreakdown,
        adminCommissionRate: 0.03,
        agentCommissionRate: 0.07
      },
      ownerEmail: form.clientEmail ? form.clientEmail.trim() : undefined,
    };

    try {
      const created = await addTrip(tripData);
      if (created?.approvalStatus === "pending") {
        toast.success("Trip saved â pending admin approval. Youâll get a notification when reviewed.");
      } else {
        toast.success("Trip saved successfully!");
      }
      router.push("/trips");
    } catch (err) {
      toast.error(
        err?.response?.data?.message || "Could not save trip. Is the API running?"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Plan Your Trip</h1>
          <p className="mt-2 text-gray-600">Create your perfect Ethiopian travel experience with our smart cost calculator</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Progress Steps */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              {stepLabels.map((label, index) => {
                const n = index + 1;
                const active = step >= n;
                const current = step === n;
                return (
                  <div key={label} className="flex items-center">
                    <div className="flex items-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                          current
                            ? "bg-blue-600 text-white"
                            : active
                            ? "bg-green-600 text-white"
                            : "border border-gray-300 text-gray-400"
                        }`}
                      >
                        {step > n ? <FiCheck className="h-4 w-4" /> : n}
                      </div>
                      <span className={`ml-2 text-sm font-medium ${
                        current ? "text-blue-600" : active ? "text-green-600" : "text-gray-400"
                      }`}>
                        {label}
                      </span>
                    </div>
                    {index < stepLabels.length - 1 && (
                      <div className={`mx-4 h-px w-16 ${
                        active ? "bg-green-600" : "bg-gray-300"
                      }`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Destination & Dates */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiMapPin className="inline mr-2 h-4 w-4" />
                    Destination
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="destination"
                      value={form.destination}
                      onChange={handleChange}
                      placeholder="Where do you want to go?"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowDestinationPopup(true)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
                    >
                      <FiSearch className="h-5 w-5" />
                    </button>
                  </div>
                  {destHits.length > 0 && (
                    <div className="mt-2 border border-gray-200 rounded-md max-h-40 overflow-y-auto">
                      {destHits.map((hit, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setForm(prev => ({ ...prev, destination: hit.name }));
                            setDestHits([]);
                          }}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium">{hit.name}</div>
                          <div className="text-sm text-gray-500">{hit.region}, {hit.country}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline mr-2 h-4 w-4" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={form.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCalendar className="inline mr-2 h-4 w-4" />
                      End Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={form.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {form.startDate && form.endDate && (
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Duration:</strong> {calculateDuration()}
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Client Email (Optional)
                  </label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={form.clientEmail}
                    onChange={handleChange}
                    placeholder="client@example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trip Cover Photo (Optional)
                  </label>
                  <label className="flex flex-col items-center justify-center h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 transition-all group overflow-hidden relative">
                    {previewImage ? (
                      <img src={previewImage} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <FiPlus className="h-8 w-8 text-gray-400 group-hover:text-blue-500 mb-2" />
                        <span className="text-sm font-medium text-gray-500 group-hover:text-blue-500">Choose from file</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                </div>
              </div>
            )}

            {/* Step 2: Accommodation & Costs */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiHome className="inline mr-2 h-4 w-4" />
                    Accommodation Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(DESTINATION_PRICING[form.destination]?.hotels || {}).map(([type, data]) => (
                      <div
                        key={type}
                        onClick={() => setForm(prev => ({ ...prev, accommodationType: type }))}
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          form.accommodationType === type
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{type}</h3>
                          <span className="text-sm text-gray-500">â {data.rating} stars</span>
                        </div>
                        <p className="text-sm text-gray-600">${data.pricePerNight} per night</p>
                        {form.accommodationType === type && (
                          <div className="mt-2 text-sm text-blue-600 font-medium">Selected</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {form.accommodationType && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">
                      <FiCreditCard className="inline mr-2 h-4 w-4" />
                      Cost Breakdown
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Accommodation ({calculateDuration()} nights):</span>
                        <span className="font-medium">${costBreakdown.accommodation}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Meals (estimated):</span>
                        <span className="font-medium">${costBreakdown.meals}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Transport (estimated):</span>
                        <span className="font-medium">${costBreakdown.transport}</span>
                      </div>
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span className="font-medium">${costBreakdown.subtotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Tax (10%):</span>
                          <span className="font-medium">${costBreakdown.tax}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Service Fee (5%):</span>
                          <span className="font-medium">${costBreakdown.serviceFee}</span>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span>Admin Commission (3%):</span>
                            <span className="font-medium text-green-600">${costBreakdown.adminCommission}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Agent Commission (7%):</span>
                            <span className="font-medium text-blue-600">${costBreakdown.agentCommission}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Company Profit:</span>
                            <span className="font-medium text-purple-600">${costBreakdown.companyProfit}</span>
                          </div>
                        </div>
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between font-medium">
                            <span>Total (Customer Pays):</span>
                            <span className="text-blue-600">${costBreakdown.total}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Activities & Budget */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Activities
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(DESTINATION_PRICING[form.destination]?.activities || {}).map(([name, data]) => {
                      const isSelected = form.activities.some(a => a.name === name);
                      return (
                        <div
                          key={name}
                          onClick={() => handleActivityToggle(name, data.price)}
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            isSelected
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-gray-900">{name}</h3>
                            <span className="text-sm font-medium text-blue-600">${data.price}</span>
                          </div>
                          <p className="text-sm text-gray-600">{data.duration}</p>
                          {isSelected && (
                            <div className="mt-2 text-sm text-blue-600 font-medium">Selected</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FiInfo className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-yellow-800">Budget Information</h3>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your total trip cost is automatically calculated based on your selections.
                        The total budget is ${Math.round(costBreakdown.total)} including all costs.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Any special requirements or preferences..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review & Payment */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Trip Summary</h3>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Trip Details</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Destination:</span>
                            <span className="text-sm font-medium">{form.destination}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Duration:</span>
                            <span className="text-sm font-medium">{calculateDuration()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Dates:</span>
                            <span className="text-sm font-medium">
                              {new Date(form.startDate).toLocaleDateString()} - {new Date(form.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Accommodation:</span>
                            <span className="text-sm font-medium">{form.accommodationType}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Activities</h4>
                        <div className="space-y-2">
                          {form.activities.map((activity, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="text-sm text-gray-600">{activity.name}:</span>
                              <span className="text-sm font-medium">${activity.price}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Summary</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Accommodation:</span>
                        <span className="font-medium">${costBreakdown.accommodation}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Activities:</span>
                        <span className="font-medium">${costBreakdown.activities}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Meals:</span>
                        <span className="font-medium">${costBreakdown.meals}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Transport:</span>
                        <span className="font-medium">${costBreakdown.transport}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Tax (10%):</span>
                        <span className="font-medium">${costBreakdown.tax}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-700">Service Fee (5%):</span>
                        <span className="font-medium">${costBreakdown.serviceFee}</span>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-green-700">Admin Commission (3%):</span>
                          <span className="font-medium text-green-600">${costBreakdown.adminCommission}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-blue-700">Agent Commission (7%):</span>
                          <span className="font-medium text-blue-600">${costBreakdown.agentCommission}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-purple-700">Company Profit:</span>
                          <span className="font-medium text-purple-600">${costBreakdown.companyProfit}</span>
                        </div>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total (Customer Pays):</span>
                          <span className="text-blue-600">${Math.round(costBreakdown.total)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start">
                    <FiCheck className="h-5 w-5 text-green-600 mt-0.5 mr-2" />
                    <div>
                      <h3 className="font-medium text-green-800">Ready to Book</h3>
                      <p className="text-sm text-green-700 mt-1">
                        Your trip is ready to be saved. Click "Complete Booking" to submit your trip for approval.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiArrowLeft className="inline mr-2 h-4 w-4" />
                Previous
              </button>
              
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Next
                  <FiArrowRight className="inline ml-2 h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <FiCheck className="mr-2 h-4 w-4" />
                      Complete Booking
                    </span>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Destination Search Popup */}
      <DestinationSearchPopup
        isOpen={showDestinationPopup}
        onClose={() => setShowDestinationPopup(false)}
        onSelect={handleDestinationSelect}
        destinations={allDestinations}
        loading={false}
      />
    </main>
  );
}

export default function AddTripPage() {
  return (
    <RequireAuth>
      <AddTripPageContent />
    </RequireAuth>
  );
}
