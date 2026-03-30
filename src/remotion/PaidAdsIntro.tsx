import React from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Orbitron";
import { loadFont as loadMono } from "@remotion/google-fonts/SpaceMono";

const { fontFamily: orbitron } = loadFont("normal", {
  weights: ["700", "900"],
  subsets: ["latin"],
});

const { fontFamily: mono } = loadMono("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

// --- Constants ---

const NEON = "#00FFB2";

// Deterministic particle data (no Math.random — must be frame-deterministic)
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  x: ((i * 137) % 1800) + 60,
  y: ((i * 233) % 900) + 90,
  size: 6 + (i % 4) * 5,
  vx: (((i * 17) % 10) - 5) * 0.06,
  vy: -(0.2 + (i % 5) * 0.12),
  shape: i % 3, // 0=line, 1=triangle, 2=hexagon
  baseOpacity: 0.12 + (i % 4) * 0.07,
}));

const MATRIX_COLS = Array.from({ length: 24 }, (_, i) => ({
  x: i * 80 + 20,
  speed: 1.2 + (i % 6) * 0.4,
  startOffset: (i * 73) % 1080,
  opacity: 0.04 + (i % 5) * 0.025,
}));

const MATRIX_CHARS =
  "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ1234567890".split(
    ""
  );

// --- Background ---

const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const cameraZoom = interpolate(frame, [0, 360], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${cameraZoom})` }}>
      <AbsoluteFill
        style={{
          background:
            "linear-gradient(160deg, #000000 0%, #000d07 50%, #001a0f 100%)",
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: [
            "linear-gradient(rgba(0,255,178,0.025) 1px, transparent 1px)",
            "linear-gradient(90deg, rgba(0,255,178,0.025) 1px, transparent 1px)",
          ].join(","),
          backgroundSize: "80px 80px",
        }}
      />
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.75) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};

// --- Matrix Streams ---

const MatrixStreams: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {MATRIX_COLS.map((col, ci) => {
        const colChars = Array.from(
          { length: 22 },
          (_, j) => MATRIX_CHARS[(ci * 7 + j * 13) % MATRIX_CHARS.length]
        );
        const yOffset = (frame * col.speed + col.startOffset) % (22 * 30);

        return (
          <div key={ci} style={{ position: "absolute", left: col.x, top: 0 }}>
            {colChars.map((char, j) => {
              const y = (j * 30 + yOffset) % 1080 - 30;
              const isHead = j === colChars.length - 1;
              return (
                <div
                  key={j}
                  style={{
                    position: "absolute",
                    top: y,
                    color: isHead ? "#ffffff" : NEON,
                    opacity: Math.min(
                      col.opacity * intensity * (isHead ? 3 : 1),
                      1
                    ),
                    fontSize: 14,
                    fontFamily: mono,
                    whiteSpace: "nowrap",
                  }}
                >
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Performance Rings (behind figure) ---

const PerformanceRings: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 100 },
  });
  const opacity = interpolate(entrance, [0, 1], [0, 0.6]);

  const rot1 = (frame * 0.8) % 360;
  const rot2 = (frame * -0.5) % 360;
  const rot3 = (frame * 1.2) % 360;

  // Rising ROAS graph — reveals over 120 frames
  const graphProgress = Math.min(frame / 120, 1);
  const graphPoints = Array.from({ length: 12 }, (_, i) => {
    const visible = i / 11 <= graphProgress;
    const x = -180 + i * 30;
    const y = 80 - i * 7 - Math.sin(i * 0.8) * 12;
    return visible ? `${x},${y}` : null;
  })
    .filter(Boolean)
    .join(" ");

  return (
    <AbsoluteFill style={{ opacity }}>
      <svg
        width="1920"
        height="1080"
        viewBox="0 0 1920 1080"
        style={{ position: "absolute" }}
      >
        <defs>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g transform="translate(1400, 540)" filter="url(#ringGlow)">
          <circle
            cx="0"
            cy="0"
            r="280"
            fill="none"
            stroke={NEON}
            strokeWidth="1"
            strokeDasharray="20 8"
            opacity="0.25"
            transform={`rotate(${rot1})`}
          />
          <path
            d="M -210 0 A 210 210 0 0 1 210 0"
            fill="none"
            stroke={NEON}
            strokeWidth="2"
            opacity="0.45"
            transform={`rotate(${rot2})`}
          />
          <circle
            cx="0"
            cy="0"
            r="140"
            fill="none"
            stroke={NEON}
            strokeWidth="1.5"
            strokeDasharray="8 16"
            opacity="0.35"
            transform={`rotate(${rot3})`}
          />
          <path
            d="M -90 -90 A 130 130 0 0 1 90 -90"
            fill="none"
            stroke={NEON}
            strokeWidth="3"
            opacity="0.7"
            transform={`rotate(${rot1 * 0.5})`}
          />
          {graphPoints.length > 0 && (
            <polyline
              points={graphPoints}
              fill="none"
              stroke={NEON}
              strokeWidth="2"
              opacity="0.35"
              transform="translate(30, 170)"
            />
          )}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// --- Figure Silhouette ---

const FigureSilhouette: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 110 },
  });
  const translateX = interpolate(entrance, [0, 1], [600, 0]);
  const opacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const floatY = Math.sin(frame * 0.04) * 12;

  const glitchCycle = frame % 42;
  const isGlitching = glitchCycle >= 39;
  const skewX = isGlitching ? Math.sin((glitchCycle - 39) * 8) * 6 : 0;
  const hueRotate = isGlitching ? (glitchCycle - 39) * 40 : 0;

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}px) translateY(${floatY}px)`,
        opacity,
        filter: `hue-rotate(${hueRotate}deg)`,
      }}
    >
      <div
        style={{
          position: "absolute",
          right: 100,
          top: "50%",
          transform: `translateY(-50%) skewX(${skewX}deg)`,
          width: 380,
          height: 680,
        }}
      >
        <svg width="380" height="680" viewBox="0 0 380 680">
          <defs>
            <filter id="figGlow">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="figGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={NEON} stopOpacity="0.95" />
              <stop offset="100%" stopColor={NEON} stopOpacity="0.2" />
            </linearGradient>
          </defs>
          {/* Head */}
          <ellipse
            cx="190"
            cy="75"
            rx="52"
            ry="60"
            fill="rgba(0,255,178,0.06)"
            stroke="url(#figGrad)"
            strokeWidth="2"
            filter="url(#figGlow)"
          />
          {/* Torso */}
          <path
            d="M110 135 L60 340 L155 340 L175 240 L205 240 L225 340 L320 340 L270 135 Z"
            fill="rgba(0,255,178,0.04)"
            stroke="url(#figGrad)"
            strokeWidth="2"
            filter="url(#figGlow)"
          />
          {/* Arms */}
          <path
            d="M115 148 L50 300 L80 312 L142 172"
            fill="none"
            stroke={NEON}
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path
            d="M265 148 L330 300 L300 312 L238 172"
            fill="none"
            stroke={NEON}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Legs */}
          <path
            d="M155 340 L120 600 L162 600 L190 450"
            fill="none"
            stroke={NEON}
            strokeWidth="1.5"
            opacity="0.5"
          />
          <path
            d="M225 340 L260 600 L218 600 L190 450"
            fill="none"
            stroke={NEON}
            strokeWidth="1.5"
            opacity="0.5"
          />
          {/* Tech detail lines */}
          <line
            x1="140"
            y1="190"
            x2="240"
            y2="190"
            stroke={NEON}
            strokeWidth="1"
            opacity="0.3"
          />
          <line
            x1="130"
            y1="225"
            x2="250"
            y2="225"
            stroke={NEON}
            strokeWidth="1"
            opacity="0.2"
          />
          <line
            x1="145"
            y1="265"
            x2="235"
            y2="265"
            stroke={NEON}
            strokeWidth="1"
            opacity="0.2"
          />
        </svg>
      </div>
    </AbsoluteFill>
  );
};

// --- Scanner Beam ---

const ScanLine: React.FC = () => {
  const frame = useCurrentFrame();
  const t = (frame % 120) / 120;
  const x = interpolate(t, [0, 1], [-20, 1940]);

  return (
    <AbsoluteFill style={{ overflow: "hidden", pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          left: x,
          top: 0,
          width: 3,
          height: 1080,
          background: `linear-gradient(to bottom, transparent 0%, ${NEON} 20%, rgba(0,255,178,0.8) 50%, ${NEON} 80%, transparent 100%)`,
          boxShadow: "0 0 30px 8px rgba(0,255,178,0.25)",
          opacity: 0.7,
        }}
      />
    </AbsoluteFill>
  );
};

// --- Corner Brackets ---

const CornerBrackets: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({ frame, fps, config: { damping: 18, stiffness: 150 } });
  const pulse = 0.6 + Math.sin(frame * 0.08) * 0.2;
  const size = 50;

  const bracketStyle = (
    flipX: number,
    flipY: number,
    pos: React.CSSProperties
  ): React.CSSProperties => ({
    position: "absolute",
    ...pos,
    width: size,
    height: size,
    opacity: entrance * pulse,
    transform: `scale(${entrance}) scaleX(${flipX}) scaleY(${flipY})`,
    borderTop: `3px solid ${NEON}`,
    borderLeft: `3px solid ${NEON}`,
    boxShadow: "0 0 12px rgba(0,255,178,0.4)",
  });

  const cx = 960;
  const cy = 540;
  const hw = 440;
  const hh = 210;

  return (
    <AbsoluteFill>
      <div style={bracketStyle(1, 1, { left: cx - hw, top: cy - hh })} />
      <div
        style={bracketStyle(-1, 1, { left: cx + hw - size, top: cy - hh })}
      />
      <div
        style={bracketStyle(1, -1, { left: cx - hw, top: cy + hh - size })}
      />
      <div
        style={bracketStyle(-1, -1, {
          left: cx + hw - size,
          top: cy + hh - size,
        })}
      />
    </AbsoluteFill>
  );
};

// --- Floating Particles ---

const FloatingParticles: React.FC<{ intensity: number }> = ({ intensity }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      {PARTICLES.map((p, i) => {
        const x = ((p.x + frame * p.vx * intensity * 60) % 1920 + 1920) % 1920;
        const y = ((p.y - frame * p.vy * intensity * 60) % 1080 + 1080) % 1080;
        const rotation = frame * (0.5 + i * 0.1);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              opacity: p.baseOpacity * intensity,
              transform: `rotate(${rotation}deg)`,
            }}
          >
            {p.shape === 0 && (
              <div style={{ width: p.size, height: 2, background: NEON }} />
            )}
            {p.shape === 1 && (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 10 10"
              >
                <polygon
                  points="5,0 10,10 0,10"
                  fill="none"
                  stroke={NEON}
                  strokeWidth="1.5"
                />
              </svg>
            )}
            {p.shape === 2 && (
              <svg
                width={p.size}
                height={p.size}
                viewBox="0 0 10 10"
              >
                <polygon
                  points="5,0 9,2.5 9,7.5 5,10 1,7.5 1,2.5"
                  fill="none"
                  stroke={NEON}
                  strokeWidth="1.5"
                />
              </svg>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// --- HUD Panel ---

const HUD_LINES = [
  {
    text: "PURE PERFORMANCE MARKETING",
    bold: true,
    fontSize: 32,
    color: NEON,
    delay: 0,
  },
  {
    text: "Lead Generation // E-commerce Scaling",
    bold: false,
    fontSize: 22,
    color: "rgba(255,255,255,0.85)",
    delay: 12,
  },
  {
    text: "Snapchat // Paid Media // SEO",
    bold: false,
    fontSize: 22,
    color: "rgba(255,255,255,0.75)",
    delay: 22,
  },
  {
    text: "Every Click Optimized. Every Dirham Accounted.",
    bold: true,
    fontSize: 20,
    color: "#AFFFDF",
    delay: 32,
  },
];

const HUDPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 120 },
  });
  const translateX = interpolate(entrance, [0, 1], [-700, 0]);
  const panelOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        transform: `translateX(${translateX}px)`,
        opacity: panelOpacity,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 60,
          top: "50%",
          transform: "translateY(-50%)",
          width: 620,
          background: "rgba(0,255,178,0.06)",
          border: "1px solid rgba(0,255,178,0.4)",
          backdropFilter: "blur(12px)",
          clipPath:
            "polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))",
          padding: "36px 40px",
        }}
      >
        {HUD_LINES.map((line, i) => {
          const lineFrame = frame - line.delay;
          const slideX = interpolate(lineFrame, [0, 18], [-40, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          });
          const lineOpacity = interpolate(lineFrame, [0, 18], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const blur = interpolate(lineFrame, [0, 18], [8, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });

          return (
            <div
              key={i}
              style={{
                transform: `translateX(${slideX}px)`,
                opacity: lineOpacity,
                filter: `blur(${blur}px)`,
                marginBottom: i < HUD_LINES.length - 1 ? 20 : 0,
              }}
            >
              <span
                style={{
                  fontFamily: mono,
                  fontSize: line.fontSize,
                  fontWeight: line.bold ? 700 : 400,
                  color: line.color,
                  letterSpacing: "0.04em",
                  textShadow: "0 0 20px rgba(0,255,178,0.5)",
                  display: "block",
                }}
              >
                {line.text}
              </span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// --- Glitch Text (RGB split) ---

const GlitchSplit: React.FC<{
  text: string;
  fontSize: number;
  glitch: number;
}> = ({ text, fontSize, glitch }) => (
  <div style={{ position: "relative", display: "inline-block" }}>
    <span
      style={{
        position: "absolute",
        color: "#FF0066",
        transform: `translateX(${glitch}px)`,
        mixBlendMode: "screen",
        fontFamily: orbitron,
        fontSize,
        fontWeight: 900,
      }}
    >
      {text}
    </span>
    <span
      style={{
        position: "absolute",
        color: "#00FFFF",
        transform: `translateX(${-glitch}px)`,
        mixBlendMode: "screen",
        fontFamily: orbitron,
        fontSize,
        fontWeight: 900,
      }}
    >
      {text}
    </span>
    <span
      style={{
        position: "relative",
        color: NEON,
        fontFamily: orbitron,
        fontSize,
        fontWeight: 900,
        textShadow:
          "0 0 40px rgba(0,255,178,0.8), 0 0 80px rgba(0,255,178,0.4)",
      }}
    >
      {text}
    </span>
  </div>
);

// --- Main Headline ---
// Phase 1 (frame 0–119):   "PAIDADS.AE"
// Phase 2 (frame 120–179): "WE DON'T RUN ADS"
// Phase 3 (frame 180–239): "WE SCALE REVENUE"

const MainHeadline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance pop-in: scale 3.2 → 1 with spring overshoot
  const entranceSpring = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 160 },
  });
  const initialScale = interpolate(entranceSpring, [0, 1], [3.2, 1]);

  // RGB glitch on entrance (frames 0–14)
  const entranceGlitch = interpolate(frame, [0, 4, 8, 14], [12, 4, 8, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Transition glitch at frame 118–125
  const g1Frame = frame - 118;
  const glitch1 =
    g1Frame >= 0 && g1Frame < 8 ? Math.abs(Math.sin(g1Frame * 7)) * 10 : 0;

  // Scale punch for phase 2
  const punch2Spring = spring({
    frame: frame - 120,
    fps,
    config: { damping: 12, stiffness: 300 },
    durationInFrames: 20,
  });
  const scale2 = interpolate(punch2Spring, [0, 0.5, 1], [1, 1.2, 1]);

  // Transition glitch at frame 178–185
  const g2Frame = frame - 178;
  const glitch2 =
    g2Frame >= 0 && g2Frame < 8 ? Math.abs(Math.sin(g2Frame * 7)) * 10 : 0;

  // Scale punch for phase 3
  const punch3Spring = spring({
    frame: frame - 180,
    fps,
    config: { damping: 12, stiffness: 300 },
    durationInFrames: 20,
  });
  const scale3 = interpolate(punch3Spring, [0, 0.5, 1], [1, 1.2, 1]);

  // Fade out headline entering final scene
  const headlineOpacity = interpolate(frame, [235, 250], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const show3 = frame >= 180;
  const show2 = frame >= 120;

  const text = show3
    ? "WE SCALE REVENUE"
    : show2
    ? "WE DON'T RUN ADS"
    : "PAIDADS.AE";
  const scale = show3 ? scale3 : show2 ? scale2 : initialScale;
  const glitch = show3 ? glitch2 : show2 ? glitch1 : entranceGlitch;
  const fontSize = show2 ? 96 : 128;

  return (
    <AbsoluteFill
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: headlineOpacity,
      }}
    >
      <div style={{ transform: `scale(${scale})`, textAlign: "center" }}>
        <GlitchSplit text={text} fontSize={fontSize} glitch={glitch} />
      </div>
    </AbsoluteFill>
  );
};

// --- Metric HUD Tags ---

const MetricTag: React.FC<{
  label: string;
  delay: number;
  x: number;
  y: number;
}> = ({ label, delay, x, y }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 15,
  });
  const blink = 0.85 + Math.sin(frame * 0.3) * 0.15;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `scale(${entrance})`,
        opacity: entrance * blink,
        background: "rgba(0,255,178,0.12)",
        border: "1px solid rgba(0,255,178,0.6)",
        padding: "10px 22px",
        clipPath:
          "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
      }}
    >
      <span
        style={{
          fontFamily: mono,
          fontSize: 26,
          fontWeight: 700,
          color: NEON,
          textShadow: "0 0 16px rgba(0,255,178,0.8)",
        }}
      >
        {label}
      </span>
    </div>
  );
};

const MetricsHUD: React.FC = () => (
  <AbsoluteFill>
    <MetricTag label="ROAS ↑" delay={0} x={680} y={200} />
    <MetricTag label="CPA ↓" delay={10} x={1100} y={280} />
    <MetricTag label="CONVERSIONS ↑" delay={20} x={800} y={760} />
  </AbsoluteFill>
);

// --- Final Scene (frame 240+) ---

const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 80 },
    durationInFrames: 40,
  });

  // Background darkens over time
  const bgDarken = interpolate(frame, [0, 80], [0, 0.65], {
    extrapolateRight: "clamp",
  });

  // Glow pulse on logo
  const glowPulse = 0.6 + Math.sin(frame * 0.1) * 0.4;

  // Fade to black at end
  const finalFade = interpolate(frame, [70, 110], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Last glitch flicker before black
  const flickerFrame = frame - 100;
  const flickerOpacity =
    flickerFrame >= 0 && flickerFrame < 8
      ? Math.abs(Math.sin(flickerFrame * 9))
      : 1;

  return (
    <AbsoluteFill style={{ opacity: fadeIn * finalFade * flickerOpacity }}>
      <AbsoluteFill
        style={{ background: `rgba(0,0,0,${bgDarken})` }}
      />
      <AbsoluteFill
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
        }}
      >
        <div
          style={{
            fontFamily: orbitron,
            fontSize: 140,
            fontWeight: 900,
            color: NEON,
            textShadow: `0 0 ${40 * glowPulse}px rgba(0,255,178,${glowPulse}), 0 0 ${80 * glowPulse}px rgba(0,255,178,${glowPulse * 0.5})`,
            letterSpacing: "0.05em",
          }}
        >
          PAIDADS.AE
        </div>
        <div
          style={{
            fontFamily: mono,
            fontSize: 30,
            fontWeight: 400,
            color: "rgba(255,255,255,0.7)",
            letterSpacing: "0.28em",
          }}
        >
          PERFORMANCE IS EVERYTHING
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// --- Root Component ---

export const PaidAdsIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const streamIntensity = interpolate(frame, [170, 195], [1, 2.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const particleIntensity = interpolate(frame, [170, 195], [1, 2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "#000" }}>
      <Background />
      <MatrixStreams intensity={streamIntensity} />
      <FloatingParticles intensity={particleIntensity} />
      <ScanLine />

      {/* Performance rings + figure — premount 30 frames early */}
      <Sequence from={35} premountFor={30}>
        <PerformanceRings />
      </Sequence>
      <Sequence from={35} premountFor={30}>
        <FigureSilhouette />
      </Sequence>

      {/* HUD panel — premount 30 frames early */}
      <Sequence from={40} premountFor={30}>
        <HUDPanel />
      </Sequence>

      <CornerBrackets />
      <MainHeadline />

      {/* Metrics burst at frame 180 */}
      <Sequence from={180} durationInFrames={60}>
        <MetricsHUD />
      </Sequence>

      {/* Final scene from frame 240 */}
      <Sequence from={240} durationInFrames={120}>
        <FinalScene />
      </Sequence>
    </AbsoluteFill>
  );
};
