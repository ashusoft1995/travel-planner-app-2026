"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RequireAdmin({ children }) {
  const { user, hydrated, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/admin/dashboard")}`);
      return;
    }
    if (!isAdmin) {
      router.replace("/dashboard");
    }
  }, [user, hydrated, isAdmin, router, pathname]);

  if (!hydrated || !user || !isAdmin) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0d0d1a]" />
    );
  }

  return children;
}
