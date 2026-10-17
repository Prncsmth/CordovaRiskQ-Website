"use client";

import { CircleCheck, CircleX, LocateFixed, LoaderCircle, MapPinOff } from "lucide-react";
import { useState } from "react";
import { CordovaMap } from "@/components/cordova-map";
import { buttonStyles, cn } from "@/components/ui";
import { isInsideCordova } from "@/lib/geofence";

type Status =
  | { kind: "idle" }
  | { kind: "locating" }
  | { kind: "inside" | "outside"; lat: number; lon: number }
  | { kind: "denied" | "unavailable" };

const MESSAGES: Record<Exclude<Status["kind"], "idle" | "locating">, { title: string; body: string }> = {
  inside: { title: "You're inside Cordova", body: "SOS and incident reports will work from where you are." },
  outside: {
    title: "You're outside Cordova",
    body: "SOS and reports won't send from here. In an emergency, call 911 or your local hotline.",
  },
  denied: { title: "Location blocked", body: "Allow location for this site in your browser to check." },
  unavailable: { title: "Couldn't get your location", body: "Your browser couldn't find your position. Try again outdoors." },
};

export function GeofenceCheck() {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const check = () => {
    if (!("geolocation" in navigator)) {
      setStatus({ kind: "unavailable" });
      return;
    }
    setStatus({ kind: "locating" });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords;
        setStatus({ kind: isInsideCordova(lat, lon) ? "inside" : "outside", lat, lon });
      },
      (error) => setStatus({ kind: error.code === error.PERMISSION_DENIED ? "denied" : "unavailable" }),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 60000 },
    );
  };

  const located = status.kind === "inside" || status.kind === "outside";
  const message = status.kind === "idle" || status.kind === "locating" ? null : MESSAGES[status.kind];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
      <figure className="relative overflow-hidden rounded-3xl border border-line bg-white p-2 sm:p-3">
        <CordovaMap you={located ? { lat: status.lat, lon: status.lon } : null} />
        <figcaption className="flex flex-wrap items-center gap-x-4 gap-y-1 px-2 pt-3 pb-1 text-xs text-muted">
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="h-0 w-5 border-t-2 border-dashed border-brand" /> Cordova boundary
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span aria-hidden className="size-2 rounded-full bg-brand" /> Barangay
          </span>
          {located ? (
            <span className="inline-flex items-center gap-1.5">
              <span aria-hidden className="size-2 rounded-full bg-[#2563eb]" /> You
            </span>
          ) : null}
        </figcaption>
      </figure>

      <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
        <h3 className="font-display text-2xl font-bold tracking-tight text-ink">Are you inside Cordova?</h3>
        <p className="mt-2 leading-relaxed text-muted">
          Check with the same boundary the app uses. Your location stays in your browser.
        </p>

        <button
          type="button"
          onClick={check}
          disabled={status.kind === "locating"}
          className={cn(buttonStyles.primary, "mt-5 w-full sm:w-auto disabled:opacity-70")}
        >
          {status.kind === "locating" ? (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          ) : (
            <LocateFixed aria-hidden className="size-4" />
          )}
          {status.kind === "locating" ? "Checking…" : located ? "Check again" : "Check my location"}
        </button>

        <div aria-live="polite" className="min-h-0">
          {message ? (
            <p
              className={cn(
                "panel-in mt-5 flex gap-3 rounded-2xl border p-4 text-sm leading-relaxed",
                status.kind === "inside"
                  ? "border-success/30 bg-success-bg text-ink"
                  : "border-brand/20 bg-brand-tint text-ink",
              )}
            >
              {status.kind === "inside" ? (
                <CircleCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-success" />
              ) : status.kind === "outside" ? (
                <CircleX aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
              ) : (
                <MapPinOff aria-hidden className="mt-0.5 size-5 shrink-0 text-brand" />
              )}
              <span>
                <strong className="block font-semibold">{message.title}</strong>
                {message.body}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
