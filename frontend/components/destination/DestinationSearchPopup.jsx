"use client";

import { useState, useEffect, useRef } from "react";
import { FiSearch, FiChevronLeft, FiChevronRight, FiMapPin, FiX } from "react-icons/fi";

export default function DestinationSearchPopup({ 
  isOpen, 
  onClose, 
  onSelect, 
  destinations = [],
  loading = false 
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef(null);

  const visibleDestinations = destinations.slice(currentIndex, currentIndex + 3);
  const canGoPrevious = currentIndex > 0;
  const canGoNext = currentIndex + 3 < destinations.length;

  const filteredDestinations = destinations.filter(dest => 
    dest.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedDestinations = searchTerm 
    ? filteredDestinations.slice(currentIndex, currentIndex + 3)
    : visibleDestinations;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentIndex(prev => Math.max(0, prev - 3));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setCurrentIndex(prev => Math.min(destinations.length - 3, prev + 3));
    }
  };

  const handleSelect = (destination) => {
    onSelect(destination);
    onClose();
    setSearchTerm("");
    setCurrentIndex(0);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentIndex(0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-300">
      <div 
        ref={popupRef}
        className="bg-white dark:bg-brand-950 border border-gray-200 dark:border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-white/10 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Choose Your Destination</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>
          
          {/* Search Bar */}
          <div className="mt-4 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search destinations..."
              className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-white/10 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : displayedDestinations.length === 0 ? (
            <div className="text-center py-12">
              <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No destinations found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? "Try adjusting your search terms" : "No destinations available"}
              </p>
            </div>
          ) : (
            <div>
              {/* Destination Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {displayedDestinations.map((destination, index) => (
                  <div
                    key={destination.id || index}
                    onClick={() => handleSelect(destination)}
                    className="group border border-gray-200 dark:border-white/10 rounded-2xl p-4 cursor-pointer hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all duration-300 bg-white dark:bg-white/5"
                  >
                    <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
                      {(destination.image || destination.imageUrl) ? (
                        <img
                          src={destination.image || destination.imageUrl}
                          alt={destination.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FiMapPin className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{destination.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {destination.region && `${destination.region}, `}
                      {destination.country || "Ethiopia"}
                    </p>
                    
                    {destination.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 line-clamp-2">
                        {destination.description}
                      </p>
                    )}
                    
                    {destination.highlights && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {destination.highlights.slice(0, 2).map((highlight, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                <button
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </button>

                <div className="text-sm text-gray-500">
                  Showing {currentIndex + 1}-{Math.min(currentIndex + displayedDestinations.length, destinations.length)} of {destinations.length}
                </div>

                <button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <FiChevronRight className="ml-2 h-4 w-4" />
                </button>
              </div>

              {/* Quick Navigation Dots */}
              <div className="flex justify-center mt-4 space-x-2">
                {Array.from({ length: Math.ceil(destinations.length / 3) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index * 3)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      Math.floor(currentIndex / 3) === index
                        ? 'bg-blue-600'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {searchTerm ? `Found ${filteredDestinations.length} destinations` : `${destinations.length} destinations available`}
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
