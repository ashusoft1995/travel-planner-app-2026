"use client";

import Link from "next/link";
import { FiClock, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PendingApprovalPage() {
  const { user, logout, hydrated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && user && user.status === "active") {
      router.replace("/login"); // send active back through login router to get to correct dashboard
    }
  }, [user, hydrated, router]);

  if (!hydrated || !user) return null;

  return (
    <main className="page-shell py-24 flex items-center justify-center min-h-[80vh]">
      <div className="container max-w-lg text-center">
        <div className="card-surface p-10 flex flex-col items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-accent-yellow/20 text-accent-yellow mb-6">
            <FiClock size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Account Under Review</h1>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Welcome to EthioTravel, <strong>{user.name}</strong>. Your Travel Agent profile is currently pending administrator review. You will be contacted once your account has been verified and fully activated.
          </p>

          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex items-center gap-2 btn-secondary text-sm"
          >
            <FiLogOut /> Sign Out
          </button>
        </div>
      </div>
    </main>
  );
}
