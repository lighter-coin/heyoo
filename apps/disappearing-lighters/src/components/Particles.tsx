"use client";

const particleConfig = [
  { left: "48%", duration: "3.2s", delay: "0s", width: 2 },
  { left: "53%", duration: "2.8s", delay: "0.6s", width: 1.5 },
  { left: "44%", duration: "4.1s", delay: "1.2s", width: 2 },
  { left: "56%", duration: "3.5s", delay: "0.3s", width: 1 },
  { left: "50%", duration: "2.6s", delay: "1.8s", width: 2 },
  { left: "46%", duration: "3.8s", delay: "0.9s", width: 1.5 },
  { left: "54%", duration: "3.0s", delay: "2.1s", width: 1 },
  { left: "49%", duration: "4.4s", delay: "1.5s", width: 2 },
  { left: "51%", duration: "2.9s", delay: "0.4s", width: 1 },
  { left: "47%", duration: "3.6s", delay: "2.4s", width: 2 },
];

export default function Particles() {
  return (
    <div className="fixed bottom-[20%] left-1/2 -translate-x-1/2 w-[200px] h-[60%] pointer-events-none z-[1]">
      {particleConfig.map((p, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full opacity-0"
          style={{
            left: p.left,
            width: p.width,
            height: p.width,
            background: "#FFB300",
            animation: `rise ${p.duration} linear infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}
