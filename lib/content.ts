/**
 * Page copy. Every feature and answer below mirrors what the CORDOVA RISKQ
 * mobile app actually does (see the app's onboarding intro, getting-started
 * tour, in-app FAQ and Terms screens). Keep it in sync with the app — do not
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
import {
  Ambulance,
  Bell,
  CarFront,
  ClipboardList,
  FileText,
  Flame,
  House,
  LifeBuoy,
  MapPinned,
  Navigation,
  Siren,
  Waves,
} from "lucide-react";

/** Phrases cycled under the hero heading. */
export const HERO_ROTATING = [
  "Send an SOS.",
  "Report an incident.",
  "Find evacuation centers.",
  "Track your responder.",
] as const;

export const HERO_CHECKS = ["Android app", "Made for Cordova, Cebu", "Location shared only when you ask"] as const;

/** Scrolling ticker of real app capabilities. */
export const TICKER = [
  "SOS with your location",
  "Incident reporting",
  "Evacuation center map",
  "Responder tracking",
  "Report history",
  "Tide-level updates",
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
    id: "history",
    label: "Report history",
    title: "Follow every report",
    description: "Report History lists your SOS alerts and reports with their status, from Pending Review to Resolved.",
    tip: "Tap New Report to file another one",
    tone: "dark",
    shots: [{ image: shotHistory, alt: "Report History listing SOS alerts and reports with their status" }],
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

/** A real screen recording or screenshot from the app — never a mock-up. */
export type ShowcaseMedia =
  | { kind: "video"; src: string; poster: string; width: number; height: number; caption: string }
  | { kind: "image"; image: StaticImageData; caption: string };

export interface ShowcaseItem {
  id: string;
  icon: LucideIcon;
  tab: string;
  title: string;
  description: string;
  facts: readonly { label: string; value: string }[];
  /** How to reach this screen in the app, as shown in the in-app FAQ. */
  path: readonly string[];
  note: string;
  media?: ShowcaseMedia;
}

export const SHOWCASE: readonly ShowcaseItem[] = [
  {
    id: "sos",
    icon: Siren,
    tab: "SOS",
    title: "Slide to send an SOS",
    description:
      "For an immediate emergency, slide the SOS button on Home and confirm. Responders receive your live location right away, so keep your phone with you.",
    facts: [
      { label: "Where", value: "Home screen" },
      { label: "How", value: "Slide, then confirm" },
      { label: "Shared", value: "Your live location" },
      { label: "Next", value: "Track the responder" },
    ],
    path: ["Home", "SOS button", "Slide to confirm"],
    note: "Use SOS only for an immediate emergency. In a life-threatening situation, also call a hotline directly.",
    media: {
      kind: "video",
      src: "/brand/slidesos.mp4",
      poster: "/brand/posters/slidesos.jpg",
      width: 1072,
      height: 2292,
      caption: "Sliding to send an SOS",
    },
  },
  {
    id: "report",
    icon: FileText,
    tab: "Report",
    title: "Report what's happening",
    description:
      "Choose the incident type, check the pinned location, add details and a photo if you can, then submit. Reports must be inside Cordova.",
    facts: [
      { label: "Types", value: "Flood, fire, medical, road accident, other" },
      { label: "Location", value: "Your current spot, or tap the map" },
      { label: "Photo", value: "Optional" },
      { label: "Seen by", value: "Authorized response teams" },
    ],
    path: ["Report", "Choose type", "Submit Report"],
    note: "Reports should reflect real, ongoing emergencies. False reports can delay help for others.",
    media: {
      kind: "video",
      src: "/brand/reportincident.mp4",
      poster: "/brand/posters/reportincident.jpg",
      width: 576,
      height: 1232,
      caption: "Reporting an incident",
    },
  },
  {
    id: "map",
    icon: MapPinned,
    tab: "Evacuation map",
    title: "Know your safer options",
    description:
      "Your nearest evacuation center is shown on Home. The Map tab lists every center — tap a pin for its details, status and directions.",
    facts: [
      { label: "Green pin", value: "Open evacuation center" },
      { label: "Red pin", value: "Full evacuation center" },
      { label: "Blue dot", value: "You" },
      { label: "Search", value: "Any barangay in Cordova" },
    ],
    path: ["Map", "Tap a pin", "Details & directions"],
    note: "Evacuation center details and status come from the CORDOVA RISKQ system.",
    media: {
      kind: "video",
      src: "/brand/evacuationcenter.mp4",
      poster: "/brand/posters/evacuationcenter.jpg",
      width: 576,
      height: 1216,
      caption: "Finding an evacuation center",
    },
  },
  {
    id: "track",
    icon: Navigation,
    tab: "Track responder",
    title: "See help on the way",
    description:
      "Once a responder accepts your SOS or report, open Track Responder to see them on the map with an estimated arrival time and a button to call them.",
    facts: [
      { label: "Available", value: "After a responder accepts" },
      { label: "Shows", value: "Responder on the map" },
      { label: "ETA", value: "Estimated arrival time" },
      { label: "Contact", value: "One-tap call" },
    ],
    path: ["SOS screen or Report History", "Track Responder"],
    note: "Tracking appears only for your own SOS or report, once it has been accepted.",
  },
  {
    id: "history",
    icon: ClipboardList,
    tab: "Report status",
    title: "Follow every report",
    description:
      "Report History lists everything you have reported with its current status, from Pending Review through to Resolved.",
    facts: [
      { label: "Where", value: "Report History tab" },
      { label: "Status", value: "Pending Review → Resolved" },
      { label: "Updates", value: "Push notifications" },
      { label: "Details", value: "Open any report" },
    ],
    path: ["Report History", "Open a report"],
    note: "Turn push notifications on or off any time in Profile › Settings.",
  },
];

export const COMPARISON = {
  without: {
    title: "Without the app",
    subtitle: "Information is scattered",
    items: [
      { title: "Explaining where you are", detail: "You describe your location from memory, often under stress." },
      { title: "Searching for an open center", detail: "Which evacuation center is open, or already full, is hard to find out." },
      { title: "No follow-up on reports", detail: "Once you've reported something, there's no easy way to see what happened next." },
      { title: "Updates spread across chats", detail: "Alerts and advisories reach people unevenly through different channels." },
    ],
  },
  with: {
    title: "With CORDOVA RISKQ",
    subtitle: "One app for Cordova",
    items: [
      { title: "Location attached automatically", detail: "Every SOS and report carries your pinned location inside Cordova." },
      { title: "Open and full centers on one map", detail: "Green and red pins show each evacuation center's status, with directions." },
      { title: "Status you can follow", detail: "Report History tracks each report from Pending Review to Resolved." },
      { title: "Alerts in one place", detail: "Report updates, tide-level updates, safety tips and nearby incident alerts." },
    ],
  },
} as const;

export interface UseCase {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  description: string;
}

export const USE_CASES: readonly UseCase[] = [
  {
    icon: Waves,
    title: "Flooding & high tide",
    subtitle: "Coastal and low-lying barangays",
    description: "Report flooding with a photo and pinned location, and keep an eye on tide-level updates in the app.",
  },
  {
    icon: Flame,
    title: "Fire",
    subtitle: "Spreading fire or heavy smoke",
    description: "Flag a fire with its exact location so response teams can assess and coordinate quickly.",
  },
  {
    icon: Ambulance,
    title: "Medical emergency",
    subtitle: "When someone needs care",
    description: "Send an SOS or a medical report, then track the responder once one accepts.",
  },
  {
    icon: CarFront,
    title: "Road accident",
    subtitle: "Collisions and blocked roads",
    description: "Report a collision, injuries or a blocked road from where you are standing.",
  },
  {
    icon: House,
    title: "Evacuation",
    subtitle: "Typhoons and severe weather",
    description: "Find your nearest evacuation center and check whether it is open or already full.",
  },
  {
    icon: LifeBuoy,
    title: "Everyday preparedness",
    subtitle: "Before anything happens",
    description: "Save official hotlines, read safety tips and keep your contact details up to date.",
  },
];

/** Factual "at a glance" numbers. Count only what the app actually ships. */
export const GLANCE = [
  { value: 7, label: "Core features" },
  { value: 5, label: "Incident report types" },
  { value: 4, label: "Steps to get started" },
  { value: 2, label: "Ways to sign up" },
] as const;

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const FEATURES: readonly Feature[] = [
  {
    icon: Siren,
    title: "SOS with your location",
    description:
      "For an immediate emergency, slide the SOS button on Home and confirm. Responders receive your live location so they can find you.",
  },
  {
    icon: FileText,
    title: "Incident reporting",
    description:
      "Report a flood, fire, medical emergency, road accident or other incident with details, an optional photo and a pinned location inside Cordova.",
  },
  {
    icon: MapPinned,
    title: "Evacuation center map",
    description:
      "See your nearest evacuation center on Home, browse every center on the map with its open or full status, and search any barangay in Cordova.",
  },
  {
    icon: Navigation,
    title: "Track your responder",
    description:
      "Once a responder accepts your SOS or report, see them on the map with an estimated arrival time and a button to call them.",
  },
  {
    icon: ClipboardList,
    title: "Report history",
    description:
      "Follow the status of everything you have reported, from Pending Review through to Resolved.",
  },
  {
    icon: Bell,
    title: "Alerts and updates",
    description:
      "Receive updates on your reports, tide-level updates, safety tips and alerts about incidents near you.",
  },
  {
    icon: LifeBuoy,
    title: "Help beyond emergencies",
    description:
      "Reach official hotlines, browse in-app FAQs, contact support and manage your account from one place.",
  },
];

export interface Step {
  title: string;
  description: string;
}

export const HOW_IT_WORKS: readonly Step[] = [
  {
    title: "Install the app",
    description:
      "Download the official APK from this page and install it on your Android phone.",
  },
  {
    title: "Create your account",
    description:
      "Sign up with email or Google, add your mobile number so responders can reach you, and review the Terms of Use and Privacy Policy.",
  },
  {
    title: "Ask for help or report",
    description:
      "Use SOS for an immediate emergency, or file a report with its type, details and pinned location.",
  },
  {
    title: "Stay informed",
    description:
      "Follow your report's status, track an assigned responder, and receive alerts for your area.",
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
      "When the app asks, allow location so it can show nearby evacuation centers and attach your location to reports and SOS alerts, and allow notifications to receive updates.",
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
    id: "hotlines",
    question: "Does the app replace calling emergency hotlines?",
    answer:
      "No. CORDOVA RISKQ helps coordinate assistance, but it does not replace calling local emergency hotlines directly in life-threatening situations. The app's Contacts screen lists official hotlines.",
  },
  {
    id: "offline",
    question: "Does it work without an internet connection?",
    answer:
      "SOS alerts and reports need a connection to reach responders. If you are in danger and cannot connect, call an emergency hotline directly — phone calls work without mobile data.",
  },
  {
    id: "data",
    question: "Who can see my location and reports?",
    answer:
      "Your location and report details are shared only when you submit a report or trigger an SOS, and only with authorized response teams so they can assess the situation and coordinate help. The full Terms of Use and Privacy Policy are shown in the app when you create your account.",
  },
  {
    id: "unknown-apps",
    question: "Is it safe to allow installing unknown apps?",
    answer:
      "Allowing it is needed for any app installed outside the Play Store. Only install APK files from sources you trust, such as this official page, and you can turn the permission off again after installing.",
  },
  {
    id: "update",
    question: "How do I update the app?",
    answer:
      "When a new version is published here, download the new APK and install it over the existing app. Your account stays the same.",
  },
];
