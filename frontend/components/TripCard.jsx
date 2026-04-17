"use client";

import Image from "next/image";
import { FiCalendar, FiMapPin, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { useTrips } from "../context/TripContext";
import { friendlyApiMessage } from "../lib/api";

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function TripCard({ trip, showDelete = true }) {
  const { deleteTrip } = useTrips();
  const img =
    trip.image ||
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=900&q=80";

  const handleDelete = async () => {
    if (!trip.id) return;
    if (!window.confirm(`Delete trip to ${trip.destination}?`)) return;
    try {
      await deleteTrip(trip.id);
      toast.success("Trip removed");
    } catch (err) {
      toast.error(friendlyApiMessage(err));
    }
  };

  const activitiesCount = Array.isArray(trip.activities) ? trip.activities.length : 0;
  const approval = trip.approvalStatus || "approved";
  const approvalLabel =
    approval === "pending"
      ? "Pending admin approval"
      : approval === "rejected"
        ? "Not approved"
        : null;

  return (
    <article className="card-surface group overflow-hidden transition hover:-translate-y-0.5 hover:shadow-xl">
      <div className="relative h-44 w-full">
        <Image
          src={img}
          alt={trip.destination || "Trip"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
          unoptimized={String(img).startsWith("data:")}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between gap-2">
          <div className="min-w-0">
            {approvalLabel && (
              <span
                className={`mb-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  approval === "pending"
                    ? "bg-amber-400/90 text-amber-950"
                    : "bg-red-500/90 text-white"
                }`}
              >
                {approvalLabel}
              </span>
            )}
            <h3 className="text-lg font-semibold text-white drop-shadow">
              {trip.destination}
            </h3>
          </div>
          {showDelete && trip.id && (
            <button
              type="button"
              onClick={handleDelete}
              className="rounded-full bg-white/20 p-2 text-white backdrop-blur transition hover:bg-red-500/80"
              aria-label="Delete trip"
            >
              <FiTrash2 size={16} />
            </button>
          )}
        </div>
      </div>
      <div className="space-y-3 p-5">
        <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
          <FiCalendar className="shrink-0 text-brand-500 dark:text-accent-yellow" />
          {formatDate(trip.startDate)} — {formatDate(trip.endDate)}
        </p>
        {trip.accommodation && (
          <p className="flex items-center gap-2 text-sm text-[var(--muted)]">
            <FiMapPin className="shrink-0 text-accent-green" />
            {trip.accommodation}
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border)] pt-3">
          <span className="text-lg font-bold text-brand-600 dark:thiext-accent-yellow">
            ${Number(trip.budget || 0).toLocaleString()}
          </span>
          <span className="text-xs text-[var(--muted)]">
            {activitiesCount} activit{activitiesCount === 1 ? "y" : "ies"}
          </span>
        </div>
      </div>
    </article>
  );
}
