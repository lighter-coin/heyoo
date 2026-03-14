"use client";

import { useState } from "react";
import { FlameIcon } from "@/components/flame-icon";

type Phase = "start" | "question" | "waiting" | "input" | "chat";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("start");

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-background px-6">
      {phase === "start" && (
        <div className="flex flex-col items-center gap-10 animate-fade-in-up">
          <FlameIcon className="h-24 w-24 animate-flicker text-flame-orange" />
          <button
            onClick={() => setPhase("question")}
            className="animate-pulse-glow rounded-full border border-flame-orange/30 bg-flame-orange/10 px-10 py-4 text-lg font-medium text-flame-orange transition-all hover:bg-flame-orange/20 hover:scale-105 active:scale-95"
          >
            Başla
          </button>
        </div>
      )}

      {phase === "question" && (
        <div className="flex max-w-md flex-col items-center gap-8 animate-fade-in-up text-center">
          <FlameIcon className="h-16 w-16 animate-flicker text-flame-orange" />
          <h1 className="text-2xl font-light leading-relaxed text-foreground/90">
            En son ne zaman birine aşık oldun?
          </h1>
          <p className="text-sm text-foreground/40">
            7 dakikan var. Düşün.
          </p>
          <button
            onClick={() => setPhase("waiting")}
            className="mt-4 text-sm text-flame-orange/60 underline underline-offset-4 transition-colors hover:text-flame-orange"
          >
            Zamanlayıcıyı başlat
          </button>
        </div>
      )}

      {phase === "waiting" && <WaitingPhase onComplete={() => setPhase("input")} />}

      {phase === "input" && <InputPhase onSubmit={() => setPhase("chat")} />}

      {phase === "chat" && (
        <div className="flex flex-col items-center gap-6 animate-fade-in-up text-center">
          <FlameIcon className="h-12 w-12 animate-flicker text-flame-orange" />
          <p className="text-foreground/60">AI Agent chat — coming soon</p>
        </div>
      )}
    </div>
  );
}

function WaitingPhase({ onComplete }: { onComplete: () => void }) {
  const DURATION = 7 * 60; // 7 minutes in seconds
  const [secondsLeft, setSecondsLeft] = useState(DURATION);
  const [started, setStarted] = useState(false);

  if (!started) {
    setStarted(true);
    // Start the countdown
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="flex flex-col items-center gap-8 animate-fade-in-up text-center">
      <FlameIcon className="h-16 w-16 animate-flicker text-flame-orange" />
      <h1 className="text-2xl font-light leading-relaxed text-foreground/90">
        En son ne zaman birine aşık oldun?
      </h1>
      <div className="text-5xl font-extralight tabular-nums text-flame-orange">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </div>
      <p className="text-sm text-foreground/30">
        Düşünmeye devam et. Acele etme.
      </p>
    </div>
  );
}

function InputPhase({ onSubmit }: { onSubmit: () => void }) {
  const [answer, setAnswer] = useState("");

  const handleSubmit = () => {
    if (answer.trim().length > 0) {
      onSubmit();
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-8 animate-fade-in-up text-center">
      <FlameIcon className="h-12 w-12 animate-flicker text-flame-orange" />
      <h1 className="text-xl font-light leading-relaxed text-foreground/90">
        Hazır olduğunda yaz.
      </h1>
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Cevabını yaz..."
        autoFocus
        className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-4 py-3 text-foreground placeholder:text-foreground/20 focus:border-flame-orange/50 focus:outline-none focus:ring-1 focus:ring-flame-orange/30"
        rows={5}
      />
      <button
        onClick={handleSubmit}
        disabled={answer.trim().length === 0}
        className="rounded-full bg-flame-orange px-8 py-3 text-base font-medium text-background transition-all hover:bg-flame-orange/90 disabled:opacity-30 disabled:cursor-not-allowed"
      >
        Gönder
      </button>
    </div>
  );
}
