"use client";
import { Player } from "@remotion/player";
import { PaidAdsIntro } from "../remotion/PaidAdsIntro";
import { BetaAdsHighImpact } from "../remotion/BetaAdsHighImpact";

export default function Home() {
  return (
    <main style={{ background: "#000", minHeight: "100vh", padding: "40px", display: "flex", flexDirection: "column", gap: "48px", fontFamily: "monospace" }}>
      <div>
        <h1 style={{ color: "#00FFB2", fontSize: 28, marginBottom: 4, letterSpacing: "0.1em" }}>🎬 VIDEO PREVIEWER</h1>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginBottom: 0 }}>Preview your Remotion compositions in the browser</p>
      </div>

      <div>
        <h2 style={{ color: "#00FFB2", fontFamily: "monospace", marginBottom: 12, fontSize: 16 }}>PaidAds Intro — 12s</h2>
        <Player
          component={PaidAdsIntro}
          durationInFrames={360}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{ width: "100%", borderRadius: 8, border: "1px solid rgba(0,255,178,0.2)" }}
          controls
        />
      </div>

      <div>
        <h2 style={{ color: "#00E5FF", fontFamily: "monospace", marginBottom: 12, fontSize: 16 }}>BetaAds High Impact — 36s</h2>
        <Player
          component={BetaAdsHighImpact}
          durationInFrames={1080}
          fps={30}
          compositionWidth={1920}
          compositionHeight={1080}
          style={{ width: "100%", borderRadius: 8, border: "1px solid rgba(0,229,255,0.2)" }}
          controls
        />
      </div>
    </main>
  );
}
