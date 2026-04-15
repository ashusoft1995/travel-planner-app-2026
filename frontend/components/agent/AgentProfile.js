"use client";

import { useState, useEffect } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiSave,
  FiX,
  FiCamera,
  FiBriefcase,
  FiAward,
  FiCalendar,
  FiCheckCircle,
} from "react-icons/fi";
import { motion } from "framer-motion";

export default function AgentProfile({ user, token }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.agentProfile?.phone || "",
    experience: user?.agentProfile?.experience || "",
    qualifications: user?.agentProfile?.qualifications || "",
    bio: user?.agentProfile?.bio || "",
    profilePhoto: user?.agentProfile?.profilePhoto || null,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      });

      if (response.ok) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setMessage("Failed to update profile. Please try again.");
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.agentProfile?.phone || "",
      experience: user?.agentProfile?.experience || "",
      qualifications: user?.agentProfile?.qualifications || "",
      bio: user?.agentProfile?.bio || "",
      profilePhoto: user?.agentProfile?.profilePhoto || null,
    });
    setIsEditing(false);
    setMessage("");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData(prev => ({
          ...prev,
          profilePhoto: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const stats = [
    {
      label: "Trips Completed",
      value: "47",
      icon: FiCheckCircle,
      color: "text-green-600"
    },
    {
      label: "Years Experience",
      value: profileData.experience || "0",
      icon: FiCalendar,
      color: "text-blue-600"
    },
    {
      label: "Client Rating",
      value: "4.8",
      icon: FiAward,
      color: "text-yellow-600"
    },
    {
      label: "Active Trips",
      value: "3",
      icon: FiBriefcase,
      color: "text-purple-600"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Agent Profile</h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiEdit2 className="mr-2 h-4 w-4" />
              Edit Profile
            </button>
          ) : (
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                <FiX className="mr-2 h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <FiSave className="mr-2 h-4 w-4" />
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          )}
        </div>

        {message && (
          <div className={`p-4 rounded-md mb-6 ${
            message.includes("success") ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"
          }`}>
            {message}
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Photo */}
          <div className="flex-shrink-0">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profileData.profilePhoto ? (
                  <img
                    src={profileData.profilePhoto}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FiUser className="h-16 w-16 text-gray-400" />
                )}
              </div>
              {isEditing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors">
                  <FiCamera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline mr-1 h-4 w-4" />
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiMail className="inline mr-1 h-4 w-4" />
                Email
              </label>
              <p className="text-gray-900">{profileData.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiPhone className="inline mr-1 h-4 w-4" />
                Phone
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.phone || "Not provided"}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiCalendar className="inline mr-1 h-4 w-4" />
                Years of Experience
              </label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.experience}
                  onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="text-gray-900">{profileData.experience || "Not specified"}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Details</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiAward className="inline mr-1 h-4 w-4" />
              Qualifications
            </label>
            {isEditing ? (
              <textarea
                value={profileData.qualifications}
                onChange={(e) => setProfileData(prev => ({ ...prev, qualifications: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="List your qualifications, certifications, etc."
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">
                {profileData.qualifications || "No qualifications listed"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiUser className="inline mr-1 h-4 w-4" />
              Bio
            </label>
            {isEditing ? (
              <textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Tell us about yourself and your experience in tourism..."
              />
            ) : (
              <p className="text-gray-900 whitespace-pre-wrap">
                {profileData.bio || "No bio provided"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-100 mb-3`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Account Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Account Type</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Agent</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Member Since</span>
            <span className="text-sm text-gray-900">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Unknown"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Agent Approval Date</span>
            <span className="text-sm text-gray-900">
              {user?.agentProfile?.approvedAt 
                ? new Date(user.agentProfile.approvedAt).toLocaleDateString() 
                : "Not available"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
