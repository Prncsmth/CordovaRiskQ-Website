/**
 * Page copy. Every feature and answer below mirrors what the CORDOVA RISKQ
 * mobile app actually does — the showcase steps are timed against the real
 * screen recordings in public/brand/v2/. Keep it in sync with the app — do not
 * describe features the app does not ship.
 */
import type { LucideIcon } from "lucide-react";
import type { StaticImageData } from "next/image";
import { APK_RELEASE } from "@/lib/release";
import shotAddPhoto from "@/public/brand/addphoto.jpg";
import shotConfirmation from "@/public/brand/confirmation.jpg";
import shotSupport from "@/public/brand/contactsupport.jpg";
import shotFaq from "@/public/brand/faqss.jpg";
import shotHistory from "@/public/brand/history.jpg";
import shotHotlines from "@/public/brand/hotlines.jpg";
import shotMap from "@/public/brand/map.jpg";
import shotReport from "@/public/brand/report.jpg";
import shotRoute from "@/public/brand/route.jpg";
import shotSettings from "@/public/brand/settings.jpg";
import shotSos from "@/public/brand/sos.jpg";
import shotViewRoute from "@/public/brand/viewroute.jpg";
import shotSignIn from "@/public/brand/guide/sign-in.jpg";
import shotSosFailed from "@/public/brand/guide/sos-failed.jpg";
import shotWelcome from "@/public/brand/guide/welcome.jpg";
import shotCoverageMap from "@/public/brand/guide/coverage-map.jpg";
import shotWithinCordova from "@/public/brand/guide/within-cordova.jpg";
import shotNotifications from "@/public/brand/guide/notifications.jpg";
import shotCriticalAlert from "@/public/brand/guide/critical-alert.jpg";
import shotSatellite from "@/public/brand/guide/satellite.jpg";
import shotTrackResponder from "@/public/brand/track-responder.jpg";
import {
  Bell,
  ClipboardList,
  FileText,
  House,
  Navigation,
  PhoneCall,
  Siren,
  WifiOff,
} from "lucide-react";

/** Phrases cycled under the hero heading. */
export const HERO_ROTATING = [
  "Send an SOS.",
  "Report an incident.",
  "Find evacuation centers.",
  "Track your responder.",
] as const;

export const HERO_CHECKS = ["Works inside Cordova, Cebu", "Location shared only when you ask"] as const;

/** Scrolling ticker of real app capabilities. */
export const TICKER = [
  "SOS with your location",
  "Incident reporting",
  "Cordova-only coverage",
  "Evacuation routes",
  "Responder tracking",
  "Report history",
  "Official hotlines",
] as const;

export type GuideTone = "red" | "light" | "dark" | "tide";

export interface GuidePanel {
  id: string;
  label: string;
  title: string;
  description: string;
  /** Short "how to" line shown as a highlighted chip. */
  tip: string;
  tone: GuideTone;
  /** One or two real app screenshots; the first is shown in front. */
  shots: readonly { image: StaticImageData; alt: string }[];
}

/**
 * App guide panels (store-listing style). Each one explains how to use a
 * feature, illustrated with real screenshots from public/brand/. Replacing a
 * screenshot file with an edited version of the same name updates the panel.
 */
export const GUIDE: readonly GuidePanel[] = [
  {
    id: "sign-in",
    label: "Get started",
    title: "Sign in once",
    description: "Log in with your email, or continue with Google. Add a mobile number so responders can call you.",
    tip: "New here? Tap Register",
    tone: "dark",
    shots: [
      { image: shotSignIn, alt: "Sign in screen with email, password and Continue with Google" },
    ],
  },
  {
    id: "sos",
    label: "SOS",
    title: "Send an SOS in seconds",
    description: "Slide the SOS button on Home, then confirm. Your location goes to responders and the app waits for one to accept.",
    tip: "Use only for a real, life-threatening emergency",
    tone: "red",
    shots: [
      { image: shotSos, alt: "SOS sent screen, waiting for a responder to accept" },
      { image: shotConfirmation, alt: "Send Emergency SOS confirmation dialog" },
    ],
  },
  {
    id: "no-signal",
    label: "No connection",
    title: "No data? Still call",
    description: "If an SOS cannot reach the server, the app offers a one-tap emergency call instead.",
    tip: "Calls can go through without mobile data",
    tone: "dark",
    shots: [
      { image: shotSosFailed, alt: "Could not send your SOS dialog with a one-tap emergency call button" },
    ],
  },
  {
    id: "report",
    label: "Report",
    title: "Report what's happening",
    description: "Pick a category — flood, fire, medical emergency, road accident or other — check the pinned location and describe what you see.",
    tip: "Add a photo from your camera or gallery",
    tone: "light",
    shots: [
      { image: shotReport, alt: "Report an Incident screen with categories and pinned location" },
      { image: shotAddPhoto, alt: "Add a photo sheet with Take a photo and Choose from gallery" },
    ],
  },
  {
    id: "geofence",
    label: "Cordova only",
    title: "Inside Cordova only",
    description: "Every SOS and report checks your pin against Cordova's boundary. Look for Within Cordova before you submit.",
    tip: "Outside Cordova? Call 911 or a local hotline",
    tone: "tide",
    shots: [
      { image: shotCoverageMap, alt: "Map of the Cordova coverage area: SOS and reports work inside the boundary and are blocked outside" },
      { image: shotWithinCordova, alt: "Pinned location card marked Within Cordova" },
    ],
  },
  {
    id: "history",
    label: "Report history",
    title: "Follow every report",
    description: "Report History lists your SOS alerts and reports with their status, from Pending Review to Resolved.",
    tip: "Tap New Report to file another one",
    tone: "dark",
    shots: [{ image: shotHistory, alt: "Report History listing SOS alerts and reports with their status" }],
  },
  {
    id: "notifications",
    label: "Notifications",
    title: "Know when help moves",
    description: "Get notified when a responder is assigned, on the way, arrives, and when your report is resolved.",
    tip: "Tap the bell on Home",
    tone: "light",
    shots: [
      { image: shotNotifications, alt: "Notifications list with responder updates" },
    ],
  },
  {
    id: "alerts",
    label: "Alerts",
    title: "Official alerts on Home",
    description: "Critical alerts and advisories from Cordova appear at the top of your Home screen, next to the tide level.",
    tip: "Tap an alert to read it in full",
    tone: "red",
    shots: [
      { image: shotCriticalAlert, alt: "Critical alert card on the Home screen above the tide level" },
    ],
  },
  {
    id: "track",
    label: "Track responder",
    title: "See help on the way",
    description: "Once a responder accepts, watch them on the map with an estimated arrival time and a button to call them.",
    tip: "Open it from the SOS screen or Report History",
    tone: "dark",
    shots: [
      { image: shotTrackResponder, alt: "Track Responder map with arrival time" },
    ],
  },
  {
    id: "map",
    label: "Evacuation map",
    title: "Find a safe place nearby",
    description: "Open the Map to see evacuation centers around Cordova. Tap a pin for its status, address and facilities.",
    tip: "Green pin: open · Red pin: full",
    tone: "tide",
    shots: [
      { image: shotViewRoute, alt: "Evacuation center details with facilities and a View Route button" },
      { image: shotMap, alt: "Map of Cordova with evacuation center pins" },
    ],
  },
  {
    id: "satellite",
    label: "Satellite map",
    title: "See the real ground",
    description: "Switch the map to satellite view and search any barangay to spot roads, rooftops and evacuation centers.",
    tip: "Use the layers button on the map",
    tone: "dark",
    shots: [
      { image: shotSatellite, alt: "Satellite view of Buagsong, Cordova with an evacuation center pin" },
    ],
  },
  {
    id: "route",
    label: "Route",
    title: "Get there safely",
    description: "Tap View Route for walking or driving directions, with trip time, distance and estimated arrival.",
    tip: "Switch between Walk and Drive",
    tone: "light",
    shots: [{ image: shotRoute, alt: "Walking route to an evacuation center with trip time and distance" }],
  },
  {
    id: "hotlines",
    label: "Hotlines",
    title: "Help is one tap away",
    description: "Official Cordova hotlines for police, fire, medical and maritime emergencies, grouped and ready to call.",
    tip: "Calls use your regular load, not mobile data",
    tone: "red",
    shots: [{ image: shotHotlines, alt: "Emergency Hotlines screen listing official Cordova hotlines" }],
  },
  {
    id: "help",
    label: "Help & support",
    title: "Answers when you need them",
    description: "Search the Help Center for answers about SOS, reports and your account, or send a message to the support team.",
    tip: "Find it in Profile › Settings › Support",
    tone: "dark",
    shots: [
      { image: shotFaq, alt: "Help Center with searchable frequently asked questions" },
      { image: shotSupport, alt: "Contact Support form" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    title: "Make it work for you",
    description: "Turn push notifications and location access on or off, switch to dark mode, and manage your account.",
    tip: "Location access helps find nearby evacuation centers",
    tone: "tide",
    shots: [{ image: shotSettings, alt: "Settings screen with notifications, location access and dark mode" }],
  },
];

/** A real screen recording from the app (public/brand/v2), never a mock-up. */
export interface Clip {
  src: string;
  poster: string;
  width: number;
  height: number;
}

const clip = (name: string, height = 1144): Clip => ({
  src: `/brand/v2/${name}.mp4`,
  poster: `/brand/v2/posters/${name}.jpg`,
  width: 540,
  height,
});

/** One moment in a recording; `at` is the second it starts. */
export interface ClipStep {
  at: number;
  label: string;
}

export interface ShowcaseItem {
  id: string;
  icon: LucideIcon;
  tab: string;
  title: string;
  summary: string;
  /** What happens in the recording, in order; shown one at a time as it plays. */
  steps: readonly ClipStep[];
  clip: Clip;
}

export const SHOWCASE: readonly ShowcaseItem[] = [
  {
    id: "sos",
    icon: Siren,
    tab: "SOS",
    title: "SOS: one slide, one tap",
    summary: "For a life-threatening emergency. Responders get your exact location.",
    steps: [
      { at: 0, label: "Slide the red SOS bar on Home" },
      { at: 1.4, label: "Confirm with Send SOS" },
      { at: 2.8, label: "The app pins your exact location" },
      { at: 6.2, label: "Sent: wait for a responder to accept" },
    ],
    clip: clip("sos", 1130),
  },
  {
    id: "track",
    icon: Navigation,
    tab: "Track responder",
    title: "See help on the way",
    summary: "Once a responder accepts, follow them live on the map.",
    steps: [
      { at: 0, label: "Responder assigned: tap Track Responder" },
      { at: 1.2, label: "See them live on the map, with arrival time" },
      { at: 3.4, label: "Call them with one tap" },
    ],
    clip: clip("track-responder", 1146),
  },
  {
    id: "report",
    icon: FileText,
    tab: "Report incident",
    title: "Report what you see",
    summary: "Not life-threatening, but responders should know. Add details and a photo.",
    steps: [
      { at: 0, label: "Pick a category: flood, fire, medical, road accident or other" },
      { at: 4.4, label: "Check the pin. It must say Within Cordova" },
      { at: 6, label: "Describe what's happening" },
      { at: 9.2, label: "Mark as urgent if needed" },
      { at: 11, label: "Add a photo (optional)" },
      { at: 22, label: "Submit Report" },
      { at: 28, label: "Responders are notified" },
    ],
    clip: clip("report-incident", 1140),
  },
  {
    id: "no-signal",
    icon: WifiOff,
    tab: "No connection",
    title: "No data? Call instead",
    summary: "If an SOS can't reach the server, the app offers a phone call right away.",
    steps: [
      { at: 0, label: "Send an SOS as usual" },
      { at: 4, label: "Couldn't send? Make an emergency call in one tap" },
    ],
    clip: clip("sos-no-signal", 1134),
  },
  {
    id: "evacuation",
    icon: House,
    tab: "Evacuation",
    title: "Find a safe place",
    summary: "See if a center is open or full, then follow the route there.",
    steps: [
      { at: 0, label: "Open or full, its facilities and distance" },
      { at: 6, label: "View Route: walk or drive, with trip time and arrival" },
    ],
    clip: clip("evacuation-center", 1144),
  },
  {
    id: "history",
    icon: ClipboardList,
    tab: "Report history",
    title: "Follow every report",
    summary: "Every SOS and report you sent, with its current status.",
    steps: [
      { at: 0, label: "Pending Review → Responder Assigned → Resolved" },
      { at: 6.5, label: "Open one for the pinned map and reference number" },
    ],
    clip: clip("report-history", 1154),
  },
  {
    id: "alerts",
    icon: Bell,
    tab: "Notifications",
    title: "Know when help moves",
    summary: "Get notified when a responder is assigned, en route, arrives and resolves.",
    steps: [
      { at: 0, label: "Updates on your reports, plus flood-risk alerts" },
      { at: 6, label: "Tap one to open the report" },
    ],
    clip: clip("notifications", 1152),
  },
  {
    id: "hotlines",
    icon: PhoneCall,
    tab: "Hotlines",
    title: "Call a hotline",
    summary: "Official Cordova hotlines for disasters, fire and police. Works anywhere.",
    steps: [
      { at: 0, label: "Pick an official hotline" },
      { at: 2.5, label: "It opens in your phone's dialer" },
    ],
    clip: clip("hotlines", 1146),
  },
];

export interface ResponderClip {
  id: string;
  title: string;
  summary: string;
  steps: readonly ClipStep[];
  clip: Clip;
}

/** What happens on the responder's phone after a resident asks for help. */
export const RESPONDER_CLIPS: readonly ResponderClip[] = [
  {
    id: "accept",
    title: "A responder accepts",
    summary: "Your SOS rings on duty responders. One accepts and heads to your pin.",
    steps: [
      { at: 0, label: "Accept" },
      { at: 2.5, label: "Head out" },
      { at: 6, label: "Navigate" },
      { at: 9, label: "Arrive" },
      { at: 14, label: "Resolve" },
    ],
    clip: clip("responder-sos", 1156),
  },
  {
    id: "barangay",
    title: "Barangay responders stay local",
    summary: "Incidents outside their assigned barangay are view-only.",
    steps: [
      { at: 0, label: "Live map" },
      { at: 4.6, label: "View only" },
    ],
    clip: clip("responder-other-barangay", 1146),
  },
  {
    id: "municipal",
    title: "The municipal team covers all of Cordova",
    summary: "The municipal team can accept incidents from any barangay.",
    steps: [
      { at: 0, label: "Accept" },
      { at: 7, label: "Team lobby" },
      { at: 16, label: "Navigate" },
    ],
    clip: clip("responder-municipal", 1144),
  },
];

/** Factual "at a glance" numbers. Count only what the app actually ships. */
export const GLANCE = [
  { value: 13, label: "Barangays covered" },
  { value: 5, label: "Incident report types" },
  { value: 4, label: "Steps to get started" },
  { value: 2, label: "Ways to sign up" },
] as const;

export interface Step {
  title: string;
  description: string;
}

export interface IllustratedStep extends Step {
  /** Real app screen for this step. */
  image: StaticImageData;
  alt: string;
  tone: GuideTone;
}

export const HOW_IT_WORKS: readonly IllustratedStep[] = [
  {
    title: "Install the app",
    description: "Download the APK from this page, open it and tap Get started.",
    image: shotWelcome,
    alt: "CORDOVA RISKQ welcome screen with a Get started button",
    tone: "red",
  },
  {
    title: "Create your account",
    description: "Sign in with email or Google, then add a mobile number responders can call.",
    image: shotSignIn,
    alt: "Sign in screen with email, password and Continue with Google",
    tone: "dark",
  },
  {
    title: "Ask for help or report",
    description: "Slide to send an SOS in an emergency, or file a report for everything else.",
    image: shotSos,
    alt: "SOS sent screen waiting for a responder to accept",
    tone: "tide",
  },
  {
    title: "Stay informed",
    description: "Get notified as your responder is assigned, on the way and arrives.",
    image: shotNotifications,
    alt: "Notifications with responder updates",
    tone: "light",
  },
];

export const INSTALL_STEPS: readonly Step[] = [
  {
    title: "Download the APK on your phone",
    description:
      "Open this page in your Android phone's browser and tap Download APK. Only download CORDOVA RISKQ from this official page.",
  },
  {
    title: "Open the downloaded file",
    description:
      "Wait until the download has fully finished — the file is over 100 MB — then tap the download notification, or open the file from your Downloads folder or Files app.",
  },
  {
    title: "Allow installation from this source",
    description:
      "If Android asks, allow your browser or Files app to install unknown apps. The setting name varies by phone; it is usually under Settings › Apps › Special app access › Install unknown apps.",
  },
  {
    title: "Install and open the app",
    description:
      "Tap Install. Google Play Protect may show a notice for apps installed outside the Play Store — continue only if the file came from this page.",
  },
  {
    title: "Allow location and notifications",
    description:
      "Location is required: the app checks that SOS alerts and reports come from inside Cordova. Allow notifications to receive updates.",
  },
];

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export const FAQS: readonly FaqItem[] = [
  {
    id: "what-is",
    question: "What is CORDOVA RISKQ?",
    answer:
      "A geolocation-based emergency and assistance coordination app for Cordova, Cebu. It lets residents send an SOS, report incidents with a pinned location, find evacuation centers, and follow updates from response teams.",
  },
  {
    id: "outside",
    question: "I'm not in Cordova. Can I use the app?",
    answer:
      "You can install it, browse the map and call hotlines, but SOS alerts and incident reports only send from inside Cordova's municipal boundary. Outside Cordova, call 911 or your local emergency hotline.",
  },
  {
    id: "sos-or-report",
    question: "Should I send an SOS or a report?",
    answer:
      "SOS is for a life-threatening emergency happening to you now: one slide sends your location. A report is for incidents responders should know about, with a category, details and an optional photo.",
  },
  {
    id: "official",
    question: "Where do I get the official app?",
    answer:
      "Only from this page. Each release lists its version, file size and SHA-256 checksum in the download section, so you can confirm the file you installed is the official one.",
  },
  {
    id: "platforms",
    question: "Which devices are supported?",
    answer:
      `This website distributes the Android app as an APK file for Android phones${APK_RELEASE.minAndroid ? ` running Android ${APK_RELEASE.minAndroid} or newer` : ""}. Install it using the installation guide above.`,
  },
  {
    id: "offline",
    question: "Does it work without an internet connection?",
    answer:
      "SOS alerts and reports need a connection. If an SOS can't be sent, the app offers a one-tap emergency call — phone calls work without mobile data.",
  },
  {
    id: "data",
    question: "Who can see my location and reports?",
    answer:
      "Your location and report details are shared only when you submit a report or send an SOS, and only with authorized response teams. The full Terms of Use and Privacy Policy are shown in the app when you create your account.",
  },
  {
    id: "update",
    question: "How do I update the app?",
    answer:
      "When a new version is published here, download the new APK and install it over the existing app. Your account stays the same.",
  },
];
