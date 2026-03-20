"use client";

import FlameAnimation from "./FlameAnimation";

interface MatchStickProps {
  flameSize?: "sm" | "lg";
}

export default function MatchStick({ flameSize = "sm" }: MatchStickProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[900] flex flex-col items-center pointer-events-none">
      {/* Flame zone */}
      <div className="relative mb-[-16px]">
        <FlameAnimation size={flameSize} />
      </div>

      {/* Match head — dark charred tip */}
      <div
        className="relative flex-shrink-0"
        style={{
          width: 28,
          height: 28,
          background: "linear-gradient(to bottom, #333333, #444141)",
          borderRadius: 6,
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
          animation: "matchStrike 0.8s ease-out 1.4s both",
        }}
      >
        {/* Sheen overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)",
            borderRadius: 5,
          }}
        />
      </div>

      {/* Match stick — wider golden wood */}
      <div
        className="mx-auto"
        style={{
          width: 20,
          height: "clamp(120px, 28dvh, 220px)",
          background: "#c0b76a",
        }}
      />
    </div>
  );
}
