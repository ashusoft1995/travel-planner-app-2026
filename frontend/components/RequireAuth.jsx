"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function RequireAuth({ children }) {
  const { user, hydrated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname || "/dashboard")}`);
    } else if (user.status === "pending" && pathname !== "/pending-approval") {
      router.replace("/pending-approval");
    }
  }, [user, hydrated, router, pathname]);

  if (!hydrated || !user || (user.status === "pending" && pathname !== "/pending-approval")) {
    return (
      <div className="fixed inset-0 z-[9999] bg-[#0d0d1a]" />
    );
  }

  return children;
}
