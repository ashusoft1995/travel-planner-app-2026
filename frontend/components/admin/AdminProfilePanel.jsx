"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { 
  FiCamera, 
  FiSave, 
  FiUser, 
  FiGlobe, 
  FiInfo, 
  FiSmartphone, 
  FiCreditCard, 
  FiShield, 
  FiLock, 
  FiAtSign,
  FiUsers,
  FiUserPlus,
  FiUserMinus,
  FiKey,
  FiRefreshCw,
  FiTrash2,
  FiCrown,
  FiSettings,
  FiActivity
} from "react-icons/fi";
import { loadUserProfile, saveUserProfile } from "../../lib/userProfileStorage";
import { useAuth } from "../../context/AuthContext";

const SUPER_ADMIN = "ashu";

export default function AdminProfilePanel({ user, onSaved }) {
  const { updateAccount, token } = useAuth();
  const [form, setForm] = useState(() => loadUserProfile(user?.email));
  const [accForm, setAccForm] = useState({
    username: user?.username || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [users, setUsers] = useState([]);
  const [agentRequests, setAgentRequests] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  const isSuperAdmin = user?.username === SUPER_ADMIN;

  useEffect(() => {
    if (!user?.email) return;
    const p = loadUserProfile(user.email);
    setForm({
      ...p,
      fullName: p.fullName || user.name || "",
    });
    setAccForm((prev) => ({ ...prev, username: user.username || "" }));
  }, [user?.email, user?.name, user?.username]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchUsers();
      fetchAgentRequests();
    }
  }, [isSuperAdmin, token]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await fetch("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAgentRequests = async () => {
    setLoadingRequests(true);
    try {
      const response = await fetch("/api/agent-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAgentRequests(data);
      }
    } catch (error) {
      console.error("Failed to fetch agent requests:", error);
      toast.error("Failed to fetch agent requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1.5 * 1024 * 1024) {
      toast.error("Profile photo should be under 1.5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () =>
      setForm((p) => ({ ...p, profilePhoto: reader.result || "" }));
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    if (!user?.email) return;

    if (!form.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    setSaving(true);
    const loadingToast = toast.loading("Updating records...");

    try {
      // 1. Save biographical info to local storage
      saveUserProfile(user.email, form);

      // 2. Clear credentials from API if requested
      const payload = { 
        name: form.fullName.trim() 
      };

      const isUsernameChanged = accForm.username.trim().toLowerCase() !== (user.username || "").toLowerCase();
      const isPasswordChanged = accForm.newPassword.length > 0;

      if (isUsernameChanged || isPasswordChanged) {
        if (!accForm.currentPassword) {
          toast.error("Current password is required to change credentials", { id: loadingToast });
          setSaving(false);
          return;
        }
        payload.currentPassword = accForm.currentPassword;
        if (isUsernameChanged) payload.username = accForm.username.trim();
        if (isPasswordChanged) {
          if (accForm.newPassword !== accForm.confirmPassword) {
            toast.error("New passwords do not match", { id: loadingToast });
            setSaving(false);
            return;
          }
          if (accForm.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters", { id: loadingToast });
            setSaving(false);
            return;
          }
          payload.password = accForm.newPassword;
        }
      }

      // 3. Update account via API
      await updateAccount(payload);

      toast.success("Identity Vault synchronized", { id: loadingToast });
      
      // Clear password fields on success
      setAccForm(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      onSaved();
    } catch (error) {
      toast.error("Update failed: " + error.message, { id: loadingToast });
    } finally {
      setSaving(false);
    }
  };

  const handleUserAction = async (userId, action) => {
    try {
      const response = await fetch(`/api/users/${userId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: action === "block" ? "blocked" : "active"
        }),
      });

      if (response.ok) {
        toast.success(`User ${action}ed successfully`);
        fetchUsers();
      } else {
        toast.error(`Failed to ${action} user`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleAgentRequest = async (requestId, action) => {
    try {
      const response = await fetch(`/api/agent-requests/${requestId}/${action}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          note: action === "approve" ? "Approved by super admin" : "Rejected by super admin"
        }),
      });

      if (response.ok) {
        toast.success(`Agent request ${action}d successfully`);
        fetchAgentRequests();
        fetchUsers();
      } else {
        toast.error(`Failed to ${action} agent request`);
      }
    } catch (error) {
      toast.error(`Failed to ${action} agent request`);
    }
  };

  const resetUserPassword = async (userId) => {
    const newPassword = prompt("Enter new password for this user:");
    if (!newPassword) return;

    try {
      const response = await fetch(`/api/users/${userId}/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword }),
      });

      if (response.ok) {
        toast.success("Password reset successfully");
      } else {
        toast.error("Failed to reset password");
      }
    } catch (error) {
      toast.error("Failed to reset password");
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: FiUser },
    { id: "security", label: "Security", icon: FiShield },
  ];

  if (isSuperAdmin) {
    tabs.push(
      { id: "users", label: "Manage Users", icon: FiUsers },
      { id: "agents", label: "Agent Requests", icon: FiUserPlus }
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon className="mr-2 h-5 w-5" />
                {tab.label}
                {tab.id === "users" && isSuperAdmin && (
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                    {users.length}
                  </span>
                )}
                {tab.id === "agents" && isSuperAdmin && (
                  <span className="ml-2 px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded-full">
                    {agentRequests.filter(r => r.status === 'pending').length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                {isSuperAdmin && (
                  <span className="ml-3 px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium flex items-center">
                    <FiCrown className="mr-1 h-3 w-3" />
                    Super Admin
                  </span>
                )}
              </div>

              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {form.profilePhoto ? (
                      <img
                        src={form.profilePhoto}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FiUser className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                    <FiCamera className="h-4 w-4" />
                    <input type="file" accept="image/*" onChange={handlePhoto} className="hidden" />
                  </label>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{form.fullName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>

              <form onSubmit={save} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiUser className="inline mr-1 h-4 w-4" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiSmartphone className="inline mr-1 h-4 w-4" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={form.phone || ""}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiGlobe className="inline mr-1 h-4 w-4" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={form.location || ""}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FiCreditCard className="inline mr-1 h-4 w-4" />
                      Bio
                    </label>
                    <textarea
                      value={form.bio || ""}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiSave className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>

              <form onSubmit={save} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FiAtSign className="inline mr-1 h-4 w-4" />
                    Username
                  </label>
                  <input
                    type="text"
                    value={accForm.username}
                    onChange={(e) => setAccForm({ ...accForm, username: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiLock className="inline mr-1 h-4 w-4" />
                        Current Password
                      </label>
                      <input
                        type="password"
                        value={accForm.currentPassword}
                        onChange={(e) => setAccForm({ ...accForm, currentPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiKey className="inline mr-1 h-4 w-4" />
                        New Password
                      </label>
                      <input
                        type="password"
                        value={accForm.newPassword}
                        onChange={(e) => setAccForm({ ...accForm, newPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FiKey className="inline mr-1 h-4 w-4" />
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={accForm.confirmPassword}
                        onChange={(e) => setAccForm({ ...accForm, confirmPassword: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    <FiSave className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {activeTab === "users" && isSuperAdmin && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Users</h2>

              {loadingUsers ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((userItem) => (
                        <tr key={userItem.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-sm font-medium text-gray-600">
                                  {userItem.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{userItem.name}</div>
                                <div className="text-sm text-gray-500">{userItem.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                              userItem.role === 'agent' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {userItem.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              userItem.status === 'active' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {userItem.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {userItem.status === 'active' ? (
                                <button
                                  onClick={() => handleUserAction(userItem.id, 'block')}
                                  className="text-red-600 hover:text-red-900"
                                  title="Block User"
                                >
                                  <FiUserMinus className="h-4 w-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUserAction(userItem.id, 'unblock')}
                                  className="text-green-600 hover:text-green-900"
                                  title="Unblock User"
                                >
                                  <FiUserPlus className="h-4 w-4" />
                                </button>
                              )}
                              <button
                                onClick={() => resetUserPassword(userItem.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Reset Password"
                              >
                                <FiRefreshCw className="h-4 w-4" />
                              </button>
                              {userItem.id !== user.id && (
                                <button
                                  onClick={() => deleteUser(userItem.id)}
                                  className="text-red-600 hover:text-red-900"
                                  title="Delete User"
                                >
                                  <FiTrash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === "agents" && isSuperAdmin && (
          <motion.div
            key="agents"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Agent Requests</h2>

              {loadingRequests ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {agentRequests.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{request.userName}</h3>
                            <span className={`ml-3 px-2 py-1 text-xs rounded-full ${
                              request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              request.status === 'approved' ? 'bg-green-100 text-green-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{request.userEmail}</p>
                          <p className="text-sm text-gray-700 mb-2">{request.bio}</p>
                          <div className="text-sm text-gray-600">
                            <p><strong>Phone:</strong> {request.phone}</p>
                            <p><strong>Experience:</strong> {request.experience}</p>
                            <p><strong>Qualifications:</strong> {request.qualifications}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            Requested: {new Date(request.requestedAt).toLocaleDateString()}
                          </p>
                        </div>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleAgentRequest(request.id, 'approve')}
                              className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleAgentRequest(request.id, 'reject')}
                              className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
