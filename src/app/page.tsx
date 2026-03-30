"use client";
import { useState } from "react";

const VIDEOS = [
  { id: "PaidAdsIntro", title: "PaidAds Intro", desc: "Cinematic cyberpunk intro for paidads.ae", meta: "12s • 360 frames • 1920×1080", color: "#00FFB2" },
  { id: "BetaAdsHighImpact", title: "BetaAds High Impact", desc: "Kinetic typography ad for BetaAds", meta: "36s • 1080 frames • 1920×1080", color: "#00E5FF" },
];

export default function Home() {
  const [rendering, setRendering] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const render = async (id: string) => {
    setRendering(id);
    setDone(null);
    setError(null);
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ composition: id }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.error);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${id}.mp4`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(id);
    } catch (e) {
      setError(String(e));
    } finally {
      setRendering(null);
    }
  };

  return (
    <main style={{ background: "#000", minHeight: "100vh", padding: "60px 40px", fontFamily: "monospace" }}>
      <h1 style={{ color: "#00FFB2", fontSize: 32, marginBottom: 8, letterSpacing: "0.1em" }}>
        🎬 VIDEO RENDER TOOL
      </h1>
      <p style={{ color: "rgba(255,255,255,0.4)", marginBottom: 48, fontSize: 14 }}>
        Select a composition and render it to MP4
      </p>
      <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
        {VIDEOS.map((v) => (
          <div key={v.id} style={{
            background: "rgba(255,255,255,0.03)",
            border: `1px solid ${rendering === v.id ? v.color : "rgba(255,255,255,0.1)"}`,
            borderRadius: 12,
            padding: 32,
            width: 360,
          }}>
            <h2 style={{ color: v.color, fontSize: 20, marginBottom: 8 }}>{v.title}</h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginBottom: 6 }}>{v.desc}</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 24 }}>{v.meta}</p>
            <button
              onClick={() => render(v.id)}
              disabled={!!rendering}
              style={{
                background: rendering === v.id ? "transparent" : v.color,
                color: rendering === v.id ? v.color : "#000",
                border: `2px solid ${v.color}`,
                borderRadius: 8,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 700,
                fontFamily: "monospace",
                cursor: rendering ? "not-allowed" : "pointer",
                width: "100%",
                opacity: rendering && rendering !== v.id ? 0.3 : 1,
              }}
            >
              {rendering === v.id ? "⏳ RENDERING..." : done === v.id ? "✓ DONE" : "▶ RENDER MP4"}
            </button>
            {done === v.id && (
              <p style={{ color: "#00FFB2", fontSize: 12, marginTop: 12, textAlign: "center" }}>
                ✓ Download started
              </p>
            )}
          </div>
        ))}
      </div>
      {error && (
        <div style={{ marginTop: 32, padding: 16, background: "rgba(255,0,0,0.1)", border: "1px solid rgba(255,0,0,0.3)", borderRadius: 8, color: "#ff6b6b", fontSize: 13 }}>
          Error: {error}
        </div>
      )}
      {rendering && (
        <p style={{ color: "rgba(255,255,255,0.4)", marginTop: 24, fontSize: 13 }}>
          ⏳ Rendering... this takes 1–3 minutes. Do not close the tab.
        </p>
      )}
    </main>
  );
}
