"use client";

import MatchStick from "./MatchStick";
import Particles from "./Particles";

interface WelcomeScreenProps {
  onEnterFire: () => void;
  onExplore: () => void;
  visible: boolean;
  exiting: boolean;
}

export default function WelcomeScreen({
  onEnterFire,
  onExplore,
  visible,
  exiting,
}: WelcomeScreenProps) {
  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-start pt-[15dvh] px-6 z-10 transition-all duration-800 ease-in-out
        ${!visible && !exiting ? "opacity-0 pointer-events-none scale-[1.02]" : ""}
        ${exiting ? "opacity-0 pointer-events-none scale-[0.98]" : ""}
        ${visible && !exiting ? "opacity-100 scale-100" : ""}
      `}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0)" }}
    >
      <div className="flex flex-col items-center text-center max-w-[420px] z-[2]">
        {/* Title */}
        <h1
          className="font-display font-black text-light text-glow-fire leading-none tracking-[0.02em] animate-[fadeInUp_0.8s_ease_forwards]"
          style={{ fontSize: "clamp(42px, 11vw, 72px)" }}
        >
          $LIGHTER
        </h1>

        {/* Subtitle */}
        <h2
          className="font-display font-bold leading-tight mt-1 bg-clip-text text-transparent animate-[fadeInUp_0.8s_ease_0.3s_forwards] opacity-0"
          style={{
            fontSize: "clamp(22px, 6vw, 40px)",
            backgroundImage: "var(--gradient-flame)",
          }}
        >
          Story of Fire
        </h2>

        {/* Tagline */}
        <p
          className="font-display italic text-ash opacity-0 animate-[fadeInUp_0.8s_ease_0.6s_forwards] max-w-[340px] mt-6"
          style={{
            fontSize: "clamp(14px, 3.5vw, 17px)",
            lineHeight: 1.7,
          }}
        >
          Bu çakmağı buldun.
          <br />
          Ama o seni mi buldu?
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3 mt-8 w-full max-w-[260px] opacity-0 animate-[fadeInUp_0.8s_ease_0.9s_forwards]">
          <button
            onClick={onEnterFire}
            className="btn-base btn-fire"
          >
            Ateşe Gir
          </button>
          <button
            onClick={onExplore}
            className="btn-base btn-gold"
          >
            Hikâyeyi Keşfet
          </button>
        </div>
      </div>

      {/* Match & Flame */}
      <MatchStick />

      {/* Particles */}
      <Particles />
    </div>
  );
}
