"use client";

import "leaflet/dist/leaflet.css";
import type { CircleMarker, Map as LeafletMap } from "leaflet";
import { useEffect, useRef } from "react";
import { CORDOVA_BOUNDARY } from "@/lib/cordova-boundary";
import { CORDOVA_BARANGAYS } from "@/lib/geofence";

/** Leaflet wants [lat, lng]; the boundary is stored as [lng, lat]. */
const RING = CORDOVA_BOUNDARY.map(([lng, lat]) => [lat, lng] as [number, number]);
/** A box around the whole area, used to dim everything outside Cordova. */
const OUTER: [number, number][] = [
  [11.5, 122.5],
  [11.5, 125.5],
  [9, 125.5],
  [9, 122.5],
];

/**
 * Real satellite map of Cordova (Esri World Imagery) with the app's coverage boundary
 * drawn on top. Leaflet touches `window`, so it loads only in the browser.
 */
export function CordovaMap({ you }: { you: { lat: number; lon: number } | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const youRef = useRef<CircleMarker | null>(null);
  const leafletRef = useRef<typeof import("leaflet") | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("leaflet").then((L) => {
      const el = containerRef.current;
      if (cancelled || !el || mapRef.current) return;
      leafletRef.current = L;

      const map = L.map(el, {
        scrollWheelZoom: false, // never hijack page scrolling
        dragging: !L.Browser.mobile, // one-finger swipes keep scrolling the page on phones
        // Tiles appear at once; the fade-in can stall on busy pages and leave them invisible.
        fadeAnimation: false,
        zoomControl: true,
        attributionControl: true,
      });
      // Satellite imagery, the same layer the app's satellite map uses, plus place names on top.
      L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        maxZoom: 18,
        attribution: "Imagery &copy; Esri, Maxar, Earthstar Geographics",
      }).addTo(map);
      L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
        { maxZoom: 18, attribution: "Labels &copy; Esri" },
      ).addTo(map);

      // Dim everything outside Cordova, then draw the boundary itself.
      L.polygon([OUTER, RING], { stroke: false, fillColor: "#000000", fillOpacity: 0.35, interactive: false }).addTo(map);
      // White halo under the red line keeps it readable over the imagery.
      L.polygon(RING, { color: "#ffffff", weight: 6, opacity: 0.85, fill: false, interactive: false }).addTo(map);
      const boundary = L.polygon(RING, {
        color: "#e11d48",
        weight: 3,
        dashArray: "8 6",
        fillColor: "#c8102e",
        fillOpacity: 0,
        interactive: false,
      }).addTo(map);

      for (const b of CORDOVA_BARANGAYS) {
        L.circleMarker([b.latitude, b.longitude], {
          radius: 5,
          color: "#ffffff",
          weight: 2,
          fillColor: "#c8102e",
          fillOpacity: 1,
        })
          .bindTooltip(b.name, { direction: "top", offset: [0, -4] })
          .addTo(map);
      }

      map.fitBounds(boundary.getBounds(), { padding: [12, 12] });
      mapRef.current = map;
    });
    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Show (or move) the visitor's own position after "Check my location".
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map) return;
    youRef.current?.remove();
    youRef.current = null;
    if (!you) return;
    youRef.current = L.circleMarker([you.lat, you.lon], {
      radius: 8,
      color: "#ffffff",
      weight: 3,
      fillColor: "#2563eb",
      fillOpacity: 1,
    })
      .bindTooltip("You", { permanent: true, direction: "right", offset: [8, 0] })
      .addTo(map);
    map.flyTo([you.lat, you.lon], Math.max(map.getZoom(), 13), { duration: 0.8 });
  }, [you]);

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label="Satellite map of the Municipality of Cordova, Cebu, with the app's coverage boundary and its 13 barangays"
      className="relative z-0 h-[24rem] w-full overflow-hidden rounded-2xl sm:h-[32rem]"
    />
  );
}
