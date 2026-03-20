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
      <div className="flex flex-col items-center text-center max-w-[420px] z-[1001]">
        {/* Title — gold like lighter-coin-website */}
        <h1
          className="font-black leading-none tracking-[0.02em] opacity-0"
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "clamp(42px, 11vw, 72px)",
            color: "#FFD700",
            animation: "litByFlame 1.4s ease-out 3.2s forwards",
          }}
        >
          $LIGHTER
        </h1>

        {/* Subtitle — animated fire gradient like lighter-coin-website */}
        <h2
          className="font-black uppercase leading-tight mt-1 opacity-0 fire-title"
          style={{
            fontSize: "clamp(22px, 6vw, 40px)",
            letterSpacing: "0.06em",
            animation: "litByFlame 1.4s ease-out 2.7s forwards",
          }}
        >
          Story of Fire
        </h2>

        {/* Tagline — warm gold text */}
        <p
          className="italic opacity-0 max-w-[340px] mt-6"
          style={{
            fontFamily: "var(--font-display), 'Playfair Display', serif",
            fontSize: "clamp(14px, 3.5vw, 17px)",
            lineHeight: 1.7,
            color: "#c8a87a",
            animation: "litByFlame 1.6s ease-out 2.2s forwards",
          }}
        >
          Bu çakmağı buldun.
          <br />
          Ama o seni mi buldu?
        </p>

        {/* Buttons — like lighter-coin-website CTA */}
        <div
          className="flex flex-col gap-3 mt-8 w-full max-w-[260px] opacity-0"
          style={{ animation: "litByFlame 1.6s ease-out 1.9s forwards" }}
        >
          <button
            onClick={onEnterFire}
            className="primary-cta"
          >
            Ateşe Gir
          </button>
          <button
            onClick={onExplore}
            className="secondary-cta"
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
