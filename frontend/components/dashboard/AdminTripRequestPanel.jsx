"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { FiImage, FiSend } from "react-icons/fi";
import { submitTravelRequestToAdmin, friendlyApiMessage } from "../../lib/api";
import { loadUserProfile } from "../../lib/userProfileStorage";

const ACCOM = ["Hotel", "Lodge", "Guesthouse", "Camping", "No preference"];

export default function AdminTripRequestPanel({ user }) {
  const [profile, setProfile] = useState(() => loadUserProfile(user?.email));
  const [travelImage, setTravelImage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [trip, setTrip] = useState({
    desiredDestination: "",
    preferredStartDate: "",
    preferredEndDate: "",
    budgetHint: "",
    accommodationPreference: "",
    specialRequests: "",
  });

  useEffect(() => {
    if (user?.email) setProfile(loadUserProfile(user.email));
  }, [user?.email]);

  const readFile = (file, setter) => {
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) {
      toast.error("Image should be under 2.5 MB");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setter(reader.result || "");
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.email) return;

    const p = loadUserProfile(user.email);
    const fullName = (p.fullName || user.name || "").trim();
    const nationality = p.nationality.trim();
    const age = Number(p.age);
    const gender = p.gender.trim();
    const travelHistory = p.travelHistorySummary.trim();

    if (!fullName || !nationality || !gender || !travelHistory) {
      toast.error("Complete your profile tab first (name, nationality, gender, travel history).");
      return;
    }
    if (!Number.isFinite(age) || age < 1) {
      toast.error("Add a valid age on your profile.");
      return;
    }
    if (!trip.desiredDestination.trim()) {
      toast.error("Where do you want to go?");
      return;
    }

    const otherStatus =
      p.maritalOrSocialStatus === "Other"
        ? (p.otherStatusDetail || "").trim()
        : "";

    setSubmitting(true);
    try {
      await submitTravelRequestToAdmin({
        accountEmail: user.email,
        fullName,
        email: user.email,
        phone: p.phone || "",
        nationality,
        age,
        gender,
        maritalOrSocialStatus: p.maritalOrSocialStatus || "",
        otherStatus,
        passportNumber: p.passportNumber || "",
        travelHistory: [travelHistory, p.bio ? `Bio: ${p.bio}` : ""]
          .filter(Boolean)
          .join("\n"),
        desiredDestination: trip.desiredDestination.trim(),
        preferredStartDate: trip.preferredStartDate,
        preferredEndDate: trip.preferredEndDate,
        budgetHint: trip.budgetHint.trim(),
        accommodationPreference: trip.accommodationPreference,
        specialRequests: trip.specialRequests.trim(),
        profilePhoto: p.profilePhoto || "",
        travelImage: travelImage || "",
      });
      toast.success("Request sent to admin inbox. Ashu’s team can review it in the API / JSON file.");
      setTrip({
        desiredDestination: "",
        preferredStartDate: "",
        preferredEndDate: "",
        budgetHint: "",
        accommodationPreference: "",
        specialRequests: "",
      });
      setTravelImage("");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Could not reach server. Start the backend on port 5000."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const syncProfilePreview = () => {
    const p = loadUserProfile(user?.email);
    setProfile(p);
    toast.success("Profile data refreshed from saved profile");
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-surface overflow-hidden"
    >
      <div className="border-b border-[var(--border)] bg-gradient-to-r from-accent-yellow/15 via-brand-600/10 to-brand-900/20 px-8 py-6">
        <h2 className="text-xl font-bold text-[var(--text)]">Submit trip plan to admin</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Send a structured trip request to our planners. We use your profile details and
          the fields below so the team can respond with a tailored proposal.
        </p>
        <button
          type="button"
          onClick={syncProfilePreview}
          className="btn-secondary mt-4 text-xs"
        >
          Refresh from saved profile
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 p-8">
        <div className="grid gap-4 rounded-2xl border border-[var(--border)] bg-black/[0.02] p-5 dark:bg-white/5 sm:grid-cols-2">
          <p className="sm:col-span-2 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
            Will be sent with your request
          </p>
          <div>
            <p className="text-xs text-[var(--muted)]">Full name</p>
            <p className="font-semibold text-[var(--text)]">
              {profile.fullName || user?.name || "— save profile first"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Email</p>
            <p className="font-semibold text-[var(--text)]">{user?.email}</p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Nationality / age / gender</p>
            <p className="text-sm text-[var(--text)]">
              {[profile.nationality, profile.age, profile.gender].filter(Boolean).join(" · ") || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-[var(--muted)]">Status</p>
            <p className="text-sm text-[var(--text)]">
              {profile.maritalOrSocialStatus === "Other"
                ? profile.otherStatusDetail || "Other"
                : profile.maritalOrSocialStatus || "—"}
            </p>
          </div>
        </div>

        <label className="block text-sm font-semibold">
          Desired destination *
          <input
            className="form-field mt-2"
            value={trip.desiredDestination}
            onChange={(e) => setTrip((t) => ({ ...t, desiredDestination: e.target.value }))}
            placeholder="e.g. Gondar & Simien Mountains"
            required
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-semibold">
            Preferred start
            <input
              type="date"
              className="form-field mt-2"
              value={trip.preferredStartDate}
              onChange={(e) => setTrip((t) => ({ ...t, preferredStartDate: e.target.value }))}
            />
          </label>
          <label className="block text-sm font-semibold">
            Preferred end
            <input
              type="date"
              className="form-field mt-2"
              value={trip.preferredEndDate}
              onChange={(e) => setTrip((t) => ({ ...t, preferredEndDate: e.target.value }))}
            />
          </label>
        </div>
        <label className="block text-sm font-semibold">
          Budget hint (optional)
          <input
            className="form-field mt-2"
            value={trip.budgetHint}
            onChange={(e) => setTrip((t) => ({ ...t, budgetHint: e.target.value }))}
            placeholder="e.g. USD 2500–3500"
          />
        </label>
        <label className="block text-sm font-semibold">
          Accommodation preference
          <select
            className="form-field mt-2"
            value={trip.accommodationPreference}
            onChange={(e) => setTrip((t) => ({ ...t, accommodationPreference: e.target.value }))}
          >
            <option value="">Select…</option>
            {ACCOM.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold">
          Special requests & notes for admin
          <textarea
            rows={4}
            className="form-field mt-2"
            value={trip.specialRequests}
            onChange={(e) => setTrip((t) => ({ ...t, specialRequests: e.target.value }))}
            placeholder="Flights, mobility, private guide, celebration dates…"
          />
        </label>

        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">Travel memory photo</p>
            <p className="mt-1 text-xs text-[var(--muted)]">
              Optional — a picture from a past trip (uploads with your request).
            </p>
            <label className="btn-secondary mt-3 inline-flex cursor-pointer items-center gap-2 text-sm">
              <FiImage /> Choose image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => readFile(e.target.files?.[0], setTravelImage)}
              />
            </label>
            {travelImage && (
              <div className="mt-3 overflow-hidden rounded-xl border border-[var(--border)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={travelImage} alt="" className="h-36 w-full object-cover" />
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-dashed border-[var(--border)] p-4 text-sm text-[var(--muted)]">
            <p className="font-semibold text-[var(--text)]">Profile photo</p>
            <p className="mt-2">
              Your profile photo is included automatically if you uploaded one in the Profile tab.
            </p>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn-primary inline-flex items-center gap-2">
          {submitting ? "Sending…" : "Send to admin"} <FiSend />
        </button>
      </form>
    </motion.section>
  );
}
