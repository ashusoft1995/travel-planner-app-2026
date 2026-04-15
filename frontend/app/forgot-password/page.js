"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { FiMail } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes("@")) {
      toast.error("Enter the email you used to register");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    requestPasswordReset(email);
    toast.success(
      "If this email exists in our system, an administrator can help you reset access."
    );
    setLoading(false);
  };

  return (
    <main className="page-shell py-16">
      <div className="container max-w-md">
        <div className="card-surface p-10">
          <h1 className="text-center text-2xl font-bold text-[var(--text)]">Forgot password</h1>
          <p className="mt-3 text-center text-sm text-[var(--muted)]">
            Password reset by email is not wired to this server build yet. Contact your administrator
            if you are locked out, or create a new account with a different email.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold">
              Email
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
                <FiMail className="text-[var(--muted)]" />
                <input
                  type="email"
                  className="w-full border-0 bg-transparent py-3 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Sending…" : "Email reset link"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            <Link href="/login" className="font-semibold text-brand-600 dark:text-accent-yellow">
              Back to sign in
            </Link>
            {" · "}
            <Link href="/signup" className="font-semibold text-brand-600 dark:text-accent-yellow">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
