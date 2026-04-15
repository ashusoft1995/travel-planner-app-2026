"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import useFastRouting from "../../hooks/useFastRouting";

import { Suspense } from "react";

function SignupContent() {
  const router = useRouter();
  const { register, user, hydrated, isAdmin } = useAuth();
  const { handleLoginRedirect } = useFastRouting();
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", confirm: "", role: "user" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated || !user) return;
    handleLoginRedirect(user);
  }, [hydrated, user, handleLoginRedirect]);

  if (hydrated && user) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) {
      toast.error("Enter your full name");
      return;
    }
    if (!form.email.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    if (form.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const registeredUser = await register(form.name, form.email, form.password, form.username, form.role);
      toast.success("Account created successfully! Redirecting to your dashboard...");
      
      // Auto-login after successful registration and redirect to appropriate dashboard
      setTimeout(() => {
        handleLoginRedirect(registeredUser);
      }, 1500);
    } catch (err) {
      toast.error(err?.message || "Could not create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell py-16">
      <div className="container max-w-md">
        <div className="card-surface p-10">
          <h1 className="text-center text-2xl font-bold text-[var(--text)]">Create account</h1>
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            New accounts are saved in <code className="rounded bg-[var(--surface)] px-1">backend/users.json</code>{" "}
            by the API on port 5000. Keep the backend running while you sign up.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold">
              Full name
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
                <FiUser className="text-[var(--muted)]" />
                <input
                  className="w-full border-0 bg-transparent py-3 outline-none"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  autoComplete="name"
                  required
                />
              </div>
            </label>
            <label className="block text-sm font-semibold">
              Email
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
                <FiMail className="text-[var(--muted)]" />
                <input
                  type="email"
                  className="w-full border-0 bg-transparent py-3 outline-none"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  autoComplete="email"
                  required
                />
              </div>
            </label>
            <label className="block text-sm font-semibold">
              Username
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
                <FiUser className="text-[var(--muted)] opacity-50" />
                <input
                  type="text"
                  className="w-full border-0 bg-transparent py-3 outline-none"
                  value={form.username}
                  onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
                  autoComplete="username"
                  required
                  placeholder="e.g. travel_expert"
                />
              </div>
            </label>
            <label className="block text-sm font-semibold">
              Password
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
                <FiLock className="text-[var(--muted)]" />
                <input
                  type="password"
                  className="w-full border-0 bg-transparent py-3 outline-none"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  autoComplete="new-password"
                  required
                />
              </div>
            </label>
            <label className="block text-sm font-semibold">
              Confirm password
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
                <FiLock className="text-[var(--muted)]" />
                <input
                  type="password"
                  className="w-full border-0 bg-transparent py-3 outline-none"
                  value={form.confirm}
                  onChange={(e) => setForm((p) => ({ ...p, confirm: e.target.value }))}
                  autoComplete="new-password"
                  required
                />
              </div>
            </label>
            <label className="block text-sm font-semibold">
              Account Type
              <select
                className="mt-2 w-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 outline-none text-brand-950 dark:text-white"
                value={form.role}
                onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
              >
                <option value="user">Self Planner (Individual)</option>
                <option value="agent">Travel Agent (Manage Clients)</option>
              </select>
            </label>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Creating…" : "Create account"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-600 dark:text-accent-yellow">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" /></div>}>
      <SignupContent />
    </Suspense>
  );
}
