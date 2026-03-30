import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Montserrat";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

// Utility: random jitter (glitch feel)
const jitter = (frame: number) => {
  return Math.sin(frame * 0.8) * 5;
};

// Kinetic Word Animation
const KineticText = ({ text }: { text: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = text.split(" ");

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          padding: "0 120px",
        }}
      >
        {words.map((word, i) => {
          const delay = i * 5;
          const opacity = interpolate(frame - delay, [0, 10], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          const scale = spring({
            frame: frame - delay,
            fps,
            config: { damping: 12, stiffness: 200 },
          });

          return (
            <span
              key={i}
              style={{
                opacity,
                transform: `scale(${scale}) translateY(${jitter(frame)}px)`,
                fontSize: 64,
                fontWeight: 700,
                fontFamily,
                color: i % 3 === 0 ? "#00E5FF" : "white",
                marginRight: 12,
                lineHeight: 1.2,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// Flash Transition Layer
const Flash = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 5, 10], [1, 0.5, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        opacity,
      }}
    />
  );
};

// Background Pulse
const Background = () => {
  const frame = useCurrentFrame();
  const scale = 1 + Math.sin(frame * 0.05) * 0.02;

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(circle at center, #0a0a0a 0%, #000 80%)",
        transform: `scale(${scale})`,
      }}
    />
  );
};

export const BetaAdsHighImpact = () => {
  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Background />

      {/* Scene 1 */}
      <Sequence from={0} durationInFrames={110}>
        <KineticText text="Most brands don't fail because of bad ideas" />
      </Sequence>

      {/* Flash Transition */}
      <Sequence from={105} durationInFrames={10}>
        <Flash />
      </Sequence>

      {/* Scene 2 */}
      <Sequence from={110} durationInFrames={110}>
        <KineticText text="They fail because they don't understand performance" />
      </Sequence>

      {/* Scene 3 */}
      <Sequence from={220} durationInFrames={90}>
        <KineticText text="Clicks Conversions Revenue" />
      </Sequence>

      {/* Scene 4 */}
      <Sequence from={310} durationInFrames={110}>
        <KineticText text="This is where BetaAds comes in" />
      </Sequence>

      {/* Scene 5 - Services Grid Burst */}
      <Sequence from={420} durationInFrames={180}>
        <KineticText text="Performance Marketing Lead Generation Ecommerce Snapchat Content SEO" />
      </Sequence>

      {/* Scene 6 */}
      <Sequence from={600} durationInFrames={110}>
        <KineticText text="We don't guess We optimize" />
      </Sequence>

      {/* Scene 7 */}
      <Sequence from={710} durationInFrames={110}>
        <KineticText text="Every click Every campaign Every dirham" />
      </Sequence>

      {/* Scene 8 */}
      <Sequence from={820} durationInFrames={110}>
        <KineticText text="Scale faster Smarter Profitably" />
      </Sequence>

      {/* Scene 9 - Final Punch */}
      <Sequence from={930} durationInFrames={150}>
        <KineticText text="BetaAds Performance is everything" />
      </Sequence>
    </AbsoluteFill>
  );
};
