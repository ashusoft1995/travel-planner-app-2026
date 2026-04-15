"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiImage, FiSave, FiX, FiStar, FiDollarSign } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function DestinationManager() {
  const { user, token } = useAuth();
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
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
    activities: {}
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const response = await fetch("/api/destinations", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDestinations(data);
      }
    } catch (error) {
      toast.error("Failed to fetch destinations");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const url = editingDestination 
        ? `/api/destinations/${editingDestination.id}`
        : "/api/destinations";
      
      const method = editingDestination ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        toast.success(`Destination ${editingDestination ? "updated" : "added"} successfully`);
        setShowForm(false);
        setEditingDestination(null);
        resetForm();
        fetchDestinations();
      }
    } catch (error) {
      toast.error(`Failed to ${editingDestination ? "update" : "add"} destination`);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    
    try {
      const response = await fetch(`/api/destinations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        toast.success("Destination deleted successfully");
        fetchDestinations();
      }
    } catch (error) {
      toast.error("Failed to delete destination");
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
      activities: {}
    });
  };

  const handleEdit = (destination) => {
    setEditingDestination(destination);
    setFormData(destination);
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

  const addHotel = () => {
    const name = prompt("Hotel name:");
    if (!name) return;
    
    setFormData(prev => ({
      ...prev,
      hotels: {
        ...prev.hotels,
        [name]: { pricePerNight: 0, rating: 3 }
      }
    }));
  };

  const updateHotel = (name, field, value) => {
    setFormData(prev => ({
      ...prev,
      hotels: {
        ...prev.hotels,
        [name]: {
          ...prev.hotels[name],
          [field]: field === "pricePerNight" ? Number(value) : Number(value)
        }
      }
    }));
  };

  const removeHotel = (name) => {
    setFormData(prev => {
      const newHotels = { ...prev.hotels };
      delete newHotels[name];
      return { ...prev, hotels: newHotels };
    });
  };

  const addActivity = () => {
    const name = prompt("Activity name:");
    if (!name) return;
    
    setFormData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [name]: { price: 0, duration: "2 hours" }
      }
    }));
  };

  const updateActivity = (name, field, value) => {
    setFormData(prev => ({
      ...prev,
      activities: {
        ...prev.activities,
        [name]: {
          ...prev.activities[name],
          [field]: field === "price" ? Number(value) : value
        }
      }
    }));
  };

  const removeActivity = (name) => {
    setFormData(prev => {
      const newActivities = { ...prev.activities };
      delete newActivities[name];
      return { ...prev, activities: newActivities };
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Destination Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingDestination(null);
            resetForm();
          }}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FiPlus className="mr-2 h-5 w-5" />
          Add Destination
        </button>
      </div>

      {/* Destinations List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="aspect-video bg-gray-200 relative">
              {destination.imageUrl ? (
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.className = 'aspect-video bg-gray-200 relative flex items-center justify-center';
                    e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg></div>';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiMapPin className="h-12 w-12 text-gray-400" />
                </div>
              )}
              <div className="absolute top-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleEdit(destination)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                >
                  <FiEdit2 className="h-4 w-4 text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(destination.id)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-red-50"
                >
                  <FiTrash2 className="h-4 w-4 text-red-600" />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{destination.name}</h3>
              <p className="text-sm text-gray-500">{destination.region}, {destination.country}</p>
              
              {destination.description && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {destination.description}
                </p>
              )}
              
              {destination.highlights && destination.highlights.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {destination.highlights.slice(0, 3).map((highlight, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="mt-3 text-xs text-gray-500">
                {Object.keys(destination.hotels || {}).length} hotels, {Object.keys(destination.activities || {}).length} activities
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingDestination ? "Edit Destination" : "Add New Destination"}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingDestination(null);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Destination Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => setFormData(prev => ({ ...prev, region: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Highlights
                    </label>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
                    >
                      <FiPlus className="inline mr-1 h-3 w-3" />
                      Add Highlight
                    </button>
                  </div>
                  {formData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="text"
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter highlight"
                      />
                      <button
                        type="button"
                        onClick={() => removeHighlight(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Hotels */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Hotels
                    </label>
                    <button
                      type="button"
                      onClick={addHotel}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200"
                    >
                      <FiPlus className="inline mr-1 h-3 w-3" />
                      Add Hotel
                    </button>
                  </div>
                  {Object.entries(formData.hotels).map(([name, hotel]) => (
                    <div key={name} className="border border-gray-200 rounded-md p-3 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{name}</h4>
                        <button
                          type="button"
                          onClick={() => removeHotel(name)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600">Price/Night</label>
                          <input
                            type="number"
                            value={hotel.pricePerNight}
                            onChange={(e) => updateHotel(name, "pricePerNight", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Rating</label>
                          <input
                            type="number"
                            value={hotel.rating}
                            onChange={(e) => updateHotel(name, "rating", e.target.value)}
                            min="1"
                            max="5"
                            step="0.5"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Activities */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Activities
                    </label>
                    <button
                      type="button"
                      onClick={addActivity}
                      className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
                    >
                      <FiPlus className="inline mr-1 h-3 w-3" />
                      Add Activity
                    </button>
                  </div>
                  {Object.entries(formData.activities).map(([name, activity]) => (
                    <div key={name} className="border border-gray-200 rounded-md p-3 mb-2">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{name}</h4>
                        <button
                          type="button"
                          onClick={() => removeActivity(name)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-gray-600">Price</label>
                          <input
                            type="number"
                            value={activity.price}
                            onChange={(e) => updateActivity(name, "price", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-600">Duration</label>
                          <input
                            type="text"
                            value={activity.duration}
                            onChange={(e) => updateActivity(name, "duration", e.target.value)}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingDestination(null);
                      resetForm();
                    }}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    <FiSave className="inline mr-2 h-4 w-4" />
                    {editingDestination ? "Update" : "Save"} Destination
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {destinations.length === 0 && (
        <div className="text-center py-12">
          <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first destination</p>
        </div>
      )}
    </div>
  );
}
