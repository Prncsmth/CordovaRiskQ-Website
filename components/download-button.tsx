import { Download } from "lucide-react";
import { release } from "@/lib/release";
import { buttonStyles, cn } from "@/components/ui";

interface DownloadButtonProps {
  className?: string;
  /** id of an element that explains the current availability. */
  describedBy?: string;
}

/** The one place the APK link is rendered. Disabled until a verified release exists. */
export function DownloadButton({ className, describedBy }: DownloadButtonProps) {
  if (!release.available) {
    return (
      <button
        type="button"
        disabled
        aria-describedby={describedBy}
        className={cn(buttonStyles.disabled, className)}
      >
        <Download aria-hidden className="size-5" />
        APK not yet available
      </button>
    );
  }

  return (
    <a
      href={release.downloadUrl}
      type="application/vnd.android.package-archive"
      download
      aria-describedby={describedBy}
      className={cn(buttonStyles.primary, className)}
    >
      <Download aria-hidden className="size-5" />
      Download APK
      <span className="font-normal opacity-85">v{release.version}</span>
    </a>
  );
}
