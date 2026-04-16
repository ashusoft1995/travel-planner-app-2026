"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FiBell } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  friendlyApiMessage,
} from "../lib/api";

const POLL_MS = 45000;

export default function NotificationBell() {
  const { user, hydrated } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const wrapRef = useRef(null);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data } = await fetchNotifications();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      if (user) toast.error(friendlyApiMessage(e));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!hydrated || !user) return undefined;
    load();
    const t = setInterval(load, POLL_MS);
    return () => clearInterval(t);
  }, [hydrated, user, load]);

  useEffect(() => {
    if (!open) return undefined;
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const unread = items.filter((n) => !n.read).length;

  const onReadOne = async (n) => {
    if (n.read) return;
    try {
      await markNotificationRead(n.id);
      setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  const onReadAll = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((x) => ({ ...x, read: true })));
    } catch (e) {
      toast.error(friendlyApiMessage(e));
    }
  };

  if (!hydrated || !user) return null;

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!open) load();
        }}
        className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition hover:bg-white/10"
        aria-label="Notifications"
      >
        <FiBell size={18} />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[1rem] items-center justify-center rounded-full bg-accent-yellow px-1 text-[10px] font-bold text-brand-950">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-[80] mt-2 w-[min(100vw-2rem,22rem)] rounded-2xl border border-[var(--border)] bg-[var(--surface)] py-2 shadow-2xl dark:border-white/10">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-3 pb-2">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--muted)]">
              Notifications
            </p>
            {unread > 0 && (
              <button
                type="button"
                onClick={onReadAll}
                className="text-xs font-semibold text-brand-600 hover:underline dark:text-accent-yellow"
              >
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-72 overflow-y-auto">
            {loading && items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">Loading…</p>
            ) : items.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-[var(--muted)]">
                You&apos;re all caught up.
              </p>
            ) : (
              items.slice(0, 40).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => onReadOne(n)}
                  className={`block w-full border-b border-[var(--border)] px-3 py-3 text-left text-sm last:border-0 hover:bg-black/[0.04] dark:hover:bg-white/5 ${
                    n.read ? "opacity-70" : "bg-brand-500/5 dark:bg-accent-yellow/10"
                  }`}
                >
                  <p className="font-semibold text-[var(--text)]">{n.title}</p>
                  <p className="mt-0.5 line-clamp-3 text-xs text-[var(--muted)]">{n.body}</p>
                  <p className="mt-1 text-[10px] text-[var(--muted)]" suppressHydrationWarning>
                    {n.createdAt ? new Date(n.createdAt).toLocaleString() : ""}
                  </p>
                </button>
              ))
            )}
          </div>
          {user.role === "admin" && (
            <div className="border-t border-[var(--border)] px-3 py-2">
              <Link
                href="/admin/dashboard"
                className="text-xs font-semibold text-brand-600 hover:underline dark:text-accent-yellow"
                onClick={() => setOpen(false)}
              >
                Open admin desk →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
