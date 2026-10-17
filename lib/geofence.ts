import { CORDOVA_BOUNDARY } from "./cordova-boundary";

/**
 * Website copy of the app's Cordova geofence. The app blocks SOS alerts and
 * incident reports sent from outside this boundary; the website only uses it
 * to tell a visitor whether they are inside Cordova. Nothing leaves the browser.
 */
export function isInsideCordova(latitude: number, longitude: number): boolean {
  return pointInRing(longitude, latitude, CORDOVA_BOUNDARY);
}

/** Even–odd ray casting. Points exactly on an edge may land either side. */
export function pointInRing(x: number, y: number, ring: readonly (readonly [number, number])[]): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Barangays of Cordova (PhilAtlas centroids, as in the app's map). */
export const CORDOVA_BARANGAYS = [
  { name: "Alegria", latitude: 10.2572, longitude: 123.9612 },
  { name: "Bangbang", latitude: 10.2588, longitude: 123.9445 },
  { name: "Buagsong", latitude: 10.2507, longitude: 123.9403 },
  { name: "Catarman", latitude: 10.2485, longitude: 123.9483 },
  { name: "Cogon", latitude: 10.2647, longitude: 123.9518 },
  { name: "Dapitan", latitude: 10.2663, longitude: 123.949 },
  { name: "Day-as", latitude: 10.2554, longitude: 123.9355 },
  { name: "Gabi", latitude: 10.2626, longitude: 123.9606 },
  { name: "Gilutongan", latitude: 10.2036, longitude: 123.9886 },
  { name: "Ibabao", latitude: 10.2707, longitude: 123.9473 },
  { name: "Pilipog", latitude: 10.2666, longitude: 123.9428 },
  { name: "Poblacion", latitude: 10.2525, longitude: 123.9502 },
  { name: "San Miguel", latitude: 10.2623, longitude: 123.9453 },
] as const;
