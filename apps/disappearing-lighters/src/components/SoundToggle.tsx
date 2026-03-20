"use client";

import { useState } from "react";

export default function SoundToggle() {
  const [soundOn, setSoundOn] = useState(false);

  return (
    <button
      onClick={() => setSoundOn(!soundOn)}
      aria-label="Toggle sound"
      className="fixed top-4 right-4 z-[100] w-9 h-9 bg-transparent border border-smoke/30 rounded-full text-smoke text-base cursor-pointer flex items-center justify-center transition-all duration-300 hover:border-smoke hover:text-ash"
      style={{
        top: "calc(env(safe-area-inset-top, 0px) + 16px)",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      {soundOn ? "🔊" : "🔇"}
    </button>
  );
}
