"use client";

export default function AmbientGlow() {
  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[600px] h-1/2 pointer-events-none z-0"
      style={{
        background: `radial-gradient(ellipse at 50% 100%,
          rgba(255, 147, 41, 0.06) 0%,
          rgba(255, 100, 20, 0.02) 30%,
          transparent 60%
        )`,
      }}
    />
  );
}
