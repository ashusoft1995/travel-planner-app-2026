"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FiGithub,
  FiInstagram,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiShield,
} from "react-icons/fi";
import { submitContactMessage, fetchMyContactMessages, friendlyApiMessage } from "../../lib/api";
import { useAuth } from "../../context/AuthContext";
import { SOCIAL } from "../../lib/socials";

const OFFICE = {
  email: "ashenafiabebe604@gmail.com",
  phone: "0997255611",
  phoneTel: "+251997255611",
  phoneDisplay: "+251 997 255 611",
  city: "Addis Ababa, Ethiopia",
};

const PRIMARY_ADMIN = {
  name: "Ashenafi Abebe",
  role: "Software engineer · manager, lead admin & supporter · travel & media",
  handle: "@ashusoft1995",
  phone: OFFICE.phone,
  phoneIntl: OFFICE.phoneDisplay,
  telegram: SOCIAL.telegramLabel,
  telegramUrl: SOCIAL.telegram,
};

const OTHER_ADMINS = [
  { name: "Jemile Koji", role: "Software engineer · travel & media" },
  { name: "Elsa Solomon", role: "Software engineer · travel & media" },
  { name: "Birhanu Alemayehu", role: "Software engineer · travel & media" },
];

const DEFAULT_ADMIN_TARGET = PRIMARY_ADMIN.name;

const ADMIN_MESSAGE_TARGETS = [
  { value: DEFAULT_ADMIN_TARGET, label: `${PRIMARY_ADMIN.name} (default · primary admin)` },
  ...OTHER_ADMINS.map((a) => ({ value: a.name, label: a.name })),
  { value: "Other", label: "Other admin" },
];

export default function ContactContent() {
  const { user, hydrated } = useAuth();
  const [myMessages, setMyMessages] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    adminTarget: DEFAULT_ADMIN_TARGET,
    otherAdminDetail: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!hydrated || !user) return;
      try {
        const { data } = await fetchMyContactMessages();
        if (!cancelled) setMyMessages(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setMyMessages([]);
      }
    })();
    return () => { cancelled = true; };
  }, [hydrated, user]);

  useEffect(() => {
    if (!hydrated || !user) return;
    setForm((p) => ({
      ...p,
      name: p.name.trim() ? p.name : user.name || "",
      email: p.email.trim() ? p.email : user.email || "",
    }));
  }, [hydrated, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill required fields");
      return;
    }
    if (form.adminTarget === "Other" && !form.otherAdminDetail.trim()) {
      toast.error("Please specify who should receive your message (Other admin)");
      return;
    }
    setLoading(true);
    try {
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
        adminTarget: form.adminTarget,
        otherAdminDetail: form.adminTarget === "Other" ? form.otherAdminDetail.trim() : "",
      });
      const recipient = form.adminTarget === "Other" ? form.otherAdminDetail.trim() : form.adminTarget;
      toast.success(`Message sent for ${recipient}. We'll reply soon.`);
      setForm({
        name: user?.name || "",
        email: user?.email || "",
        subject: "",
        message: "",
        adminTarget: DEFAULT_ADMIN_TARGET,
        otherAdminDetail: "",
      });
      if (user) {
        try {
          const { data } = await fetchMyContactMessages();
          setMyMessages(Array.isArray(data) ? data : []);
        } catch { /* ignore */ }
      }
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell py-16">
      <div className="container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-600 dark:text-accent-yellow">
            Contact & admin
          </p>
          <h1 className="mt-3 text-3xl font-bold text-[var(--text)]">
            Reach the EthioTravel team
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[var(--muted)]">
            We are software engineers with deep expertise in travel and media. Use the
            form below — your message goes to our{" "}
            <strong className="text-[var(--text)]">admin inbox</strong> (support
            handled by {PRIMARY_ADMIN.name}, {PRIMARY_ADMIN.handle}). When you&apos;re signed in,
            admin replies also show as <strong className="text-[var(--text)]">notifications</strong>{" "}
            in the header bell.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="card-surface p-8">
              <div className="flex items-center gap-2 text-brand-600 dark:text-accent-yellow">
                <FiShield className="text-xl" />
                <h2 className="font-bold text-[var(--text)]">Admin team</h2>
              </div>

              <div className="mt-6 rounded-2xl border border-[var(--border)] bg-black/[0.02] p-5 dark:bg-white/5">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                  Primary admin & supporter
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--text)]">{PRIMARY_ADMIN.name}</p>
                <p className="text-sm text-[var(--muted)]">{PRIMARY_ADMIN.role}</p>
                <p className="mt-2 text-sm text-[var(--text)]">
                  Username:{" "}
                  <span className="font-semibold text-brand-600 dark:text-accent-yellow">
                    {PRIMARY_ADMIN.handle}
                  </span>
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-brand-600 dark:text-accent-yellow">
                  <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                    <FiGithub /> GitHub {SOCIAL.githubLabel}
                  </a>
                  <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 hover:underline">
                    <FiInstagram /> {SOCIAL.instagramLabel}
                  </a>
                </div>
                <p className="mt-4 flex items-center gap-2 text-sm text-[var(--text)]">
                  <FiPhone className="shrink-0 text-brand-600 dark:text-accent-yellow" />
                  <a href="tel:+251997255611" className="font-semibold hover:underline">{PRIMARY_ADMIN.phoneIntl}</a>
                  <span className="text-[var(--muted)]">({PRIMARY_ADMIN.phone})</span>
                </p>
                <p className="mt-2 text-sm text-[var(--text)]">
                  Telegram:{" "}
                  <a href={PRIMARY_ADMIN.telegramUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline dark:text-accent-yellow">
                    {PRIMARY_ADMIN.telegram}
                  </a>
                </p>
              </div>

              <div className="mt-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Other admins</p>
                <ul className="mt-3 space-y-3 text-sm">
                  {OTHER_ADMINS.map((a) => (
                    <li key={a.name} className="flex items-center justify-between gap-2 rounded-xl border border-[var(--border)] px-4 py-3">
                      <span className="font-medium text-[var(--text)]">{a.name}</span>
                      <span className="text-xs text-[var(--muted)]">{a.role}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="card-surface p-8">
              <h3 className="font-bold text-[var(--text)]">Office</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3">
                  <FiMail className="mt-0.5 shrink-0 text-brand-600 dark:text-accent-yellow" />
                  <a href={`mailto:${OFFICE.email}`} className="font-medium text-[var(--text)] hover:text-brand-600 hover:underline dark:hover:text-accent-yellow">{OFFICE.email}</a>
                </li>
                <li className="flex gap-3">
                  <FiPhone className="mt-0.5 shrink-0 text-brand-600 dark:text-accent-yellow" />
                  <a href={`tel:${OFFICE.phoneTel}`} className="font-semibold text-[var(--text)] hover:text-brand-600 hover:underline dark:hover:text-accent-yellow">{OFFICE.phoneDisplay}</a>
                  <span className="text-[var(--muted)]">({OFFICE.phone})</span>
                </li>
                <li className="flex gap-3">
                  <FiMapPin className="mt-0.5 shrink-0 text-brand-600 dark:text-accent-yellow" />
                  <span className="text-[var(--muted)]">{OFFICE.city}</span>
                </li>
                <li className="flex gap-3">
                  <FiSend className="mt-0.5 shrink-0 text-brand-600 dark:text-accent-yellow" />
                  <a href={SOCIAL.telegram} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline dark:text-accent-yellow">Telegram — {SOCIAL.telegramLabel}</a>
                </li>
                <li className="flex gap-3">
                  <FiInstagram className="mt-0.5 shrink-0 text-brand-600 dark:text-accent-yellow" />
                  <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline dark:text-accent-yellow">Instagram — {SOCIAL.instagramLabel}</a>
                </li>
                <li className="flex gap-3">
                  <FiGithub className="mt-0.5 shrink-0 text-brand-600 dark:text-accent-yellow" />
                  <a href={SOCIAL.github} target="_blank" rel="noopener noreferrer" className="font-semibold text-brand-600 hover:underline dark:text-accent-yellow">GitHub — {SOCIAL.githubLabel}</a>
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleSubmit}
            className="card-surface space-y-4 p-8 lg:col-span-2"
          >
            <div>
              <h2 className="text-xl font-bold text-[var(--text)]">Message admin support</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Default recipient: <strong className="text-[var(--text)]">{PRIMARY_ADMIN.name}</strong> ({PRIMARY_ADMIN.handle}). Use the dropdown to message another admin or choose Other and say who should receive it.
              </p>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Send message to</label>
              <select
                className="form-field w-full"
                value={form.adminTarget}
                onChange={(e) => setForm((p) => ({ ...p, adminTarget: e.target.value, otherAdminDetail: e.target.value === "Other" ? p.otherAdminDetail : "" }))}
              >
                {ADMIN_MESSAGE_TARGETS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {form.adminTarget === "Other" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">Which admin or team? (required)</label>
                <input className="form-field w-full" placeholder="e.g. name, role, or department" value={form.otherAdminDetail} onChange={(e) => setForm((p) => ({ ...p, otherAdminDetail: e.target.value }))} required />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <input className="form-field" placeholder="Your name" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
              <input type="email" className="form-field" placeholder="Your email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
            </div>
            <input className="form-field" placeholder="Subject (optional)" value={form.subject} onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))} />
            <textarea rows={5} className="form-field" placeholder="Your message to admin support…" value={form.message} onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))} required />
            <button type="submit" disabled={loading} className="btn-primary inline-flex items-center gap-2">
              {loading ? "Sending…" : "Send to admin"} <FiSend />
            </button>
          </motion.form>
        </div>

        {user && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-surface mt-12 p-8"
          >
            <h2 className="text-xl font-bold text-[var(--text)]">Your support messages</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Threads where your account email matches the message. Admin replies appear here and in your notification bell.
            </p>
            {myMessages.length === 0 ? (
              <p className="mt-6 text-sm text-[var(--muted)]">No messages yet — use the form above.</p>
            ) : (
              <ul className="mt-6 space-y-4">
                {myMessages.map((m) => (
                  <li key={m.id} className="rounded-2xl border border-[var(--border)] bg-black/[0.02] p-4 dark:bg-white/5">
                    <p className="text-xs text-[var(--muted)]">{m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}</p>
                    <p className="mt-1 font-semibold text-[var(--text)]">{m.subject || "Message to admin"}</p>
                    <p className="mt-2 text-sm text-[var(--text)]">{m.message}</p>
                    {Array.isArray(m.replies) && m.replies.length > 0 && (
                      <div className="mt-3 border-t border-[var(--border)] pt-3">
                        <p className="text-xs font-bold uppercase text-brand-600 dark:text-accent-yellow">Admin replies</p>
                        <ul className="mt-2 space-y-2">
                          {m.replies.map((r) => (
                            <li key={r.id} className="rounded-lg bg-brand-50/80 p-3 text-sm dark:bg-brand-950/30">
                              <span className="text-xs text-[var(--muted)]">{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</span>
                              <p className="mt-1 text-[var(--text)]">{r.body}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </motion.section>
        )}
      </div>
    </main>
  );
}
