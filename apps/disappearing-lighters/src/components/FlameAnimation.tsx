"use client";

interface FlameAnimationProps {
  size?: "sm" | "lg";
}

export default function FlameAnimation({ size = "sm" }: FlameAnimationProps) {
  const isLg = size === "lg";

  return (
    <div className="relative flex flex-col items-center">
      {/* Outer glow */}
      <div
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{
          width: isLg ? 220 : 160,
          height: isLg ? 220 : 160,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(255,147,41,0.2) 0%, rgba(255,147,41,0.05) 40%, transparent 70%)",
          animation: "glowPulse 2.5s ease-in-out infinite",
        }}
      />

      {/* Main flame */}
      <div
        className="absolute bottom-[6px] left-1/2"
        style={{
          width: isLg ? 30 : 22,
          height: isLg ? 70 : 55,
          transform: "translateX(-50%)",
          background: `radial-gradient(ellipse at 50% 85%,
            #FFF8E1 0%,
            #FFB300 20%,
            #E8832A 45%,
            #D4651A 70%,
            transparent 100%
          )`,
          borderRadius: "50% 50% 20% 20%",
          filter: "blur(0.8px)",
          animation: isLg
            ? "flickerLg 0.12s infinite alternate, sway 2.2s ease-in-out infinite"
            : "flicker 0.12s infinite alternate, sway 2.2s ease-in-out infinite",
        }}
      >
        {/* Inner bright flame */}
        <div
          className="absolute bottom-[2px] left-1/2"
          style={{
            width: isLg ? 18 : 14,
            height: isLg ? 52 : 40,
            transform: "translateX(-50%)",
            background: `radial-gradient(ellipse at 50% 80%,
              #ffffff 0%,
              #FFF8E1 20%,
              #FFB300 50%,
              transparent 100%
            )`,
            borderRadius: "50% 50% 20% 20%",
            animation: isLg
              ? "innerFlickerLg 0.09s infinite alternate"
              : "innerFlicker 0.09s infinite alternate",
          }}
        />
        {/* Blue base */}
        <div
          className="absolute left-1/2"
          style={{
            bottom: -3,
            width: isLg ? 14 : 10,
            height: isLg ? 14 : 10,
            transform: "translateX(-50%)",
            background: "#1565c0",
            borderRadius: "50%",
            filter: "blur(3px)",
            opacity: 0.6,
          }}
        />
      </div>
    </div>
  );
}
