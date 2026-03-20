"use client";

import FlameAnimation from "./FlameAnimation";

interface MatchStickProps {
  flameSize?: "sm" | "lg";
}

export default function MatchStick({ flameSize = "sm" }: MatchStickProps) {
  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[1] flex flex-col items-center pointer-events-none">
      {/* Flame zone */}
      <div className="relative w-[70px] h-[100px] md:w-[90px] md:h-[120px] mb-[-10px]">
        <FlameAnimation size={flameSize} />
      </div>

      {/* Match head */}
      <div
        className="w-[10px] h-[16px] md:w-[12px] md:h-[18px] rounded-t-[4px] rounded-b-[2px] relative"
        style={{
          background: "linear-gradient(to bottom, #1a1a1a 0%, #2d1810 40%, #3e2215 100%)",
        }}
      />

      {/* Match stick */}
      <div
        className="w-1 md:w-[5px] h-[clamp(100px,28dvh,220px)] rounded-b-[1px] mx-auto"
        style={{
          background: "linear-gradient(to bottom, #7a6548 0%, #9a845e 40%, #b09878 100%)",
        }}
      />
    </div>
  );
}
