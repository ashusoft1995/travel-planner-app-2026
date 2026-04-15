"use client";

import { useAuth } from "../../../../context/AuthContext";
import AdminProfilePanel from "../../../../components/admin/AdminProfilePanel";

export default function AdminProfilePage() {
  const { user } = useAuth();
  
  return (
    <AdminProfilePanel user={user} onSaved={() => {}} />
  );
}
