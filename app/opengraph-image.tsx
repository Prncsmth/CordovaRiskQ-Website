import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

export const alt = `${SITE.name} — Emergency Assistance. Better Coordination.`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const logo = await readFile(join(process.cwd(), "public/brand/riskq-logo-360.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 64,
          padding: "0 88px",
          background: "linear-gradient(135deg, #ffffff 0%, #fff7f5 55%, #fdecea 100%)",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img> */}
        <img src={logoSrc} width={300} height={300} alt="" />
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <div style={{ fontSize: 34, fontWeight: 800, color: "#c8102e", letterSpacing: 1 }}>{SITE.name}</div>
          <div style={{ display: "flex", flexDirection: "column", marginTop: 20, fontSize: 64, fontWeight: 800, color: "#17181a", lineHeight: 1.08 }}>
            <span>Emergency Assistance.</span>
            <span style={{ color: "#c8102e" }}>Better Coordination.</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 28, color: "#5f6672" }}>
            Android app for {SITE.locality}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
