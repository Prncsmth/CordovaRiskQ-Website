/**
 * Page copy. Every feature and answer below mirrors what the CORDOVA RISKQ
 * mobile app actually does (see the app's onboarding intro, getting-started
 * tour, in-app FAQ and Terms screens). Keep it in sync with the app — do not
 * describe features the app does not ship.
 */
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ClipboardList,
  FileText,
  LifeBuoy,
  MapPinned,
  Navigation,
  Siren,
} from "lucide-react";

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
      "Tap the download notification, or open the file from your Downloads folder or Files app.",
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
    id: "availability",
    question: "Why can't I download the app yet?",
    answer:
      "The APK is published here only once an official build is released and its download link has been verified. Until then the download button stays disabled. Please check back on this page.",
  },
  {
    id: "platforms",
    question: "Which devices are supported?",
    answer:
      "This website distributes the Android app as an APK file. Install it on an Android phone using the installation guide above.",
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
