"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { FiLock, FiMail } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import useFastRouting from "../../hooks/useFastRouting";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const { login, user, hydrated, isAdmin } = useAuth();
  const { handleLoginRedirect } = useFastRouting();
  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!hydrated || !user) return;
    
    // Use fast routing for immediate redirection
    handleLoginRedirect(user, next);
  }, [hydrated, user, next, handleLoginRedirect]);

  // If already authenticated, bypass rendering entirely to speed up redirect
  if (hydrated && user) {
    return <div className="min-h-screen bg-brand-950" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = form.identifier.trim();
    if (id.includes("@")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id)) {
        toast.error("Enter a valid email");
        return;
      }
    } else if (id.length < 2) {
      toast.error("Enter your email or admin username");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const signedIn = await login(id, form.password);
      toast.success("Welcome back â youâre signed in.");
      
      // Use fast routing for immediate redirection
      handleLoginRedirect(signedIn, next);
    } catch (err) {
      const m = err?.message;
      toast.error(
        m === "Invalid email or password"
          ? "We couldn’t sign you in. Check your email or password, then try again."
          : m || "We couldn’t complete sign-in. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell py-16">
      <div className="container max-w-md">
        <div className="card-surface p-10">
          <h1 className="text-center text-2xl font-bold text-[var(--text)]">Sign in</h1>
          <p className="mt-2 text-center text-sm text-[var(--muted)]">
            Sign in to use your dashboard, save trips, and sync your itineraries with your
            EthioTravel account. New here? Create an account—it only takes a moment.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block text-sm font-semibold">
              Email or username
              <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3">
                <FiMail className="text-[var(--muted)]" />
                <input
                  type="text"
                  className="w-full border-0 bg-transparent py-3 outline-none"
                  value={form.identifier}
                  onChange={(e) => setForm((p) => ({ ...p, identifier: e.target.value }))}
                  autoComplete="username"
                  placeholder="you@example.com or ashu"
                  required
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
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <Link
                href="/forgot-password"
                className="font-semibold text-brand-600 hover:underline dark:text-accent-yellow"
              >
                Forgot password?
              </Link>
              <Link
                href="/signup"
                className="font-semibold text-brand-600 hover:underline dark:text-accent-yellow"
              >
                Create account
              </Link>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[var(--muted)]">
            <Link href="/" className="font-semibold text-brand-600 dark:text-accent-yellow">
              Back home
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
