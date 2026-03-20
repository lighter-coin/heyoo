"use client";

interface FlameAnimationProps {
  size?: "sm" | "lg";
}

export default function FlameAnimation({ size = "sm" }: FlameAnimationProps) {
  const isLg = size === "lg";
  const svgHeight = isLg ? 160 : 100;
  const svgWidth = isLg ? 100 : 63;

  return (
    <div
      className="relative flex flex-col items-center"
      style={{ width: svgWidth, height: svgHeight }}
    >
      {/* Outer glow */}
      <div
        className="absolute bottom-0 left-1/2 pointer-events-none"
        style={{
          width: isLg ? 300 : 200,
          height: isLg ? 300 : 200,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(circle, rgba(255,140,30,0.25) 0%, rgba(255,100,0,0.08) 40%, transparent 70%)",
          animation: "glowPulse 2.5s ease-in-out infinite",
        }}
      />

      {/* SVG Flame — from lighter-coin-website */}
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox="0 0 125 189.864"
        style={{ width: svgWidth, height: svgHeight }}
      >
        <g clipPath="url(#flameClip)">
          <path
            className="flame-main"
            d="M58.2214 189.757C58.2214 189.757 48.0434 186.781 42.8964 181.531C37.7494 176.281 33.6184 164.711 33.6184 164.711C33.6184 164.711 33.3774 158.064 29.4824 146.246C29.4824 146.246 32.8394 151.215 34.5854 156.184C34.5854 156.184 29.2804 135.098 36.2974 125.766C43.3144 116.433 36.8684 90.1124 34.0474 88.2324C34.0474 88.2324 47.1174 93.8724 53.9224 135.772C60.7284 177.671 70.7534 181.073 60.0104 189.757"
            fill="#F36E21"
            style={{ animation: "flameWobble 3s linear infinite" }}
          />
          <path
            className="flame-main-one"
            d="M43.3615 125.924C47.4785 110.524 55.4585 111.437 31.7725 65.0518C31.7725 65.0518 63.7885 75.2748 84.3735 128.175C104.958 181.074 64.5255 189.22 64.7305 189.757C64.9365 190.294 45.3295 189.488 49.8955 171.225C54.4615 152.962 39.2445 141.323 43.3615 125.924Z"
            fill="#F6891F"
            style={{ animation: "flameWobble 4s linear 1s infinite" }}
          />
          <path
            d="M63.3255 82.8594C63.3255 82.8594 74.8745 107.704 66.9515 122.879C59.0275 138.054 45.8255 164.778 66.5265 187.877C66.5265 187.877 107.373 154.572 63.3255 82.8594Z"
            fill="#FFD04A"
            style={{ animation: "flameWobble 3s linear 2s infinite" }}
          />
          <path
            d="M81.5883 105.421C81.5883 105.421 58.3803 152.448 69.5453 185.493C69.5453 185.493 102.286 169.42 89.6533 139.703C77.0223 109.986 81.5883 117.775 81.5883 105.421Z"
            fill="#FDBA16"
            style={{ animation: "flameWobble 2.1s linear 3s infinite" }}
          />
          <path
            d="M84.8117 109.584C84.8117 109.584 93.7387 140.337 83.7687 156.452C73.7997 172.567 68.9697 185.493 68.9697 185.493C68.9697 185.493 116.056 168.27 84.8117 109.584Z"
            fill="#F36E21"
            style={{ animation: "flameWobble 3.2s linear 4s infinite" }}
          />
          <path
            d="M43.7178 107.838C43.7178 107.838 28.0728 175.426 54.2468 185.493C80.4218 195.561 50.7018 134.428 43.7178 107.838Z"
            fill="#FDBA16"
            style={{ animation: "flameWobble 2.5s linear 5s infinite" }}
          />
          <path
            d="M82.6797 116.593C82.6797 116.593 91.6527 127.112 87.2357 133.136C81.0387 133.402 88.4207 121.073 82.6797 116.593Z"
            fill="#F36E21"
            style={{ animation: "flamefly 2s linear infinite", opacity: 0 }}
          />
          <path
            d="M37.2602 130.521C37.2602 130.521 33.4412 143.811 39.9592 147.466C45.7062 145.147 37.5752 135.93 37.2602 130.521Z"
            fill="#F36E21"
            style={{ animation: "flamefly 3s linear 1s infinite", opacity: 0 }}
          />
          <path
            d="M36.5863 108.262C36.5863 108.262 32.6273 114.371 35.3463 117.211C38.5983 116.923 33.8963 110.996 36.5863 108.262Z"
            fill="#F36E21"
            style={{ animation: "flamefly 2s linear infinite", opacity: 0 }}
          />
        </g>
        <defs>
          <clipPath id="flameClip">
            <rect width="125" height="189.864" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
