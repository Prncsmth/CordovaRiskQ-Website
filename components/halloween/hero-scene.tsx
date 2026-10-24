import Image from "next/image";
import { Bats, CobwebCorner, Fog } from "@/components/halloween/decor";

/** The red forest behind the hero, with webs, bats and fog. Halloween only. */
export function HalloweenHeroScene() {
  return (
    <div aria-hidden className="hw-only pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Image
        src="/halloween/forest.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hw-forest object-cover"
      />
      {/* Darken toward the edges and under the text so the headline stays readable. */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_68%_40%,transparent_0%,rgb(12_10_11/0.55)_60%,#0c0a0b_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(12_10_11/0.85)_0%,rgb(12_10_11/0.45)_45%,transparent_70%)] max-lg:bg-[linear-gradient(180deg,rgb(12_10_11/0.7)_0%,rgb(12_10_11/0.35)_50%,rgb(12_10_11/0.8)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-b from-transparent to-[#0c0a0b]" />
      <CobwebCorner corner="tl" />
      <CobwebCorner corner="tr" />
      <Bats />
      <Fog />
    </div>
  );
}
