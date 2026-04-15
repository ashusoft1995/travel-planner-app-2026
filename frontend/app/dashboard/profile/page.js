"use client";

import { useAuth } from "../../../context/AuthContext";
import ProfilePanel from "../../../components/dashboard/ProfilePanel";
import { useState } from "react";

export default function DashboardProfilePage() {
  const { user } = useAuth();
  const [profileRev, setProfileRev] = useState(0);

  return (
    <ProfilePanel 
      user={user} 
      onSaved={() => setProfileRev((n) => n + 1)} 
      key={profileRev} 
    />
  );
}
