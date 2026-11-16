import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const alt = `${profile.identity.name} — ${profile.identity.headline.join(" ")}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const paper = "#fefdf9";
const ink = "#14152b";
const ink2 = "#5a5d72";
const accent = "#6d4aff";

/** Designed 1200×630 card for LinkedIn, WhatsApp and X previews. */
export default function OpengraphImage() {
  const { identity, site, stats } = profile;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: paper,
          color: ink,
          backgroundImage: `linear-gradient(rgba(20,21,43,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(20,21,43,0.06) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: ink2, letterSpacing: 2 }}>
          <span>{`SHEET 01 / ${identity.name.toUpperCase()}`}</span>
          <span style={{ display: "flex", alignItems: "center" }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: accent, marginRight: 12 }} />
            <span>{identity.statusShort}</span>
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 132, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>
            {identity.headline.join(" ")}
          </div>
          <div style={{ marginTop: 28, fontSize: 34, maxWidth: 1000, lineHeight: 1.25 }}>{site.brandStory}</div>
          <div style={{ marginTop: 14, fontSize: 24, color: ink2 }}>{`${identity.title} @ ${identity.company}`}</div>
        </div>

        <div style={{ display: "flex", borderTop: `2px solid ${ink}`, paddingTop: 22, fontSize: 24 }}>
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", marginRight: 56 }}>
              <span style={{ fontSize: 38, fontWeight: 700, color: s === stats[0] ? accent : ink }}>
                {/* "Rs" because the default OG font has no rupee glyph */ `${"prefix" in s && s.prefix ? "Rs " : ""}${s.value.toLocaleString("en-IN")}${"suffix" in s ? s.suffix : ""}`}
              </span>
              <span style={{ fontSize: 18, color: ink2, letterSpacing: 2 }}>{s.label.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
