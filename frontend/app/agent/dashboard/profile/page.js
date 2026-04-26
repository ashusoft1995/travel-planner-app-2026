"use client";

import { useAuth } from "../../../../context/AuthContext";
import ProfilePanel from "../../../../components/dashboard/ProfilePanel";

export default function AgentProfilePage() {
  const { user } = useAuth();
  
  return (
    <ProfilePanel user={user} onSaved={() => {}} />
  );
}
