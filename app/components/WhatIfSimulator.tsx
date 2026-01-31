"use client";

import { useMemo, useState } from "react";
import { computeScores } from "@/lib/scoring";

type Props = {
  baseLog: any;
  baseScore: any;
  previewScore: any | null;
  onSimulate: (score: any) => void;
  onReset: () => void;
};

export function WhatIfSimulator({
  baseLog,
  baseScore,
  previewScore,
  onSimulate,
  onReset,
}: Props) {
  const [sleepBoost, setSleepBoost] = useState(0);
  const [endEarly, setEndEarly] = useState(false);
  const [extraBreak, setExtraBreak] = useState(false);

  const simulateDelta = (delta: {
    sleepMinutes?: number;
    breakMinutes?: number;
    workEarly?: boolean;
  }) => {
    // 🔹 conservative deltas (REALISTIC)
    let riskChange = 0;
    let rciChange = 0;
  
    if (delta.sleepMinutes) {
      riskChange -= delta.sleepMinutes * 0.05;   // 30 min ≈ -1.5
      rciChange += delta.sleepMinutes * 0.04;
    }
  
    if (delta.breakMinutes) {
      riskChange -= delta.breakMinutes * 0.03;   // 15 min ≈ -0.45
      rciChange += delta.breakMinutes * 0.02;
    }
  
    if (delta.workEarly) {
      riskChange -= 4;    // moderate relief
      rciChange += 3;
    }
  
    const nextRisk = Math.max(
      5, // ❗ never 0 (important)
      Math.min(95, baseScore.risk + riskChange)
    );
  
    const nextRCI = Math.max(
      5,
      Math.min(95, baseScore.rci + rciChange)
    );

    const nextDrift = Math.round(
      baseScore.driftVelocity +
        (riskChange > 0 ? 0.5 : -0.5)
    );
    
  
    return {
      ...baseScore,
      risk: Math.round(nextRisk),
      rci: Math.round(nextRCI),
      driftVelocity: nextDrift,
      zone:
        nextRisk > 70
          ? "Risk Zone"
          : nextRisk > 40
          ? "Strain Zone"
          : "Stable Zone",
    };
  };
  
  

  // ✅ reset helper (INSIDE component)
  const resetAll = () => {
    setSleepBoost(0);
    setEndEarly(false);
    setExtraBreak(false);
  };

  const scoreToShow = previewScore ?? baseScore;

  const improved =
  previewScore &&
  previewScore.driftVelocity < baseScore.driftVelocity;

  

  return (
    <div className="mt-10 p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold">Try one small change 🧪</h2>
          <p className="text-sm text-white/60">
            Just testing… no commitment 😄
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
          Instant result
        </span>
      </div>

      {/* CONTROLS */}
      <div className="grid md:grid-cols-3 gap-6">

        {/* SLEEP */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10">
          <p className="text-sm font-semibold mb-1">😴 Sleep</p>
          <p className="text-xs text-white/60 mb-3">Add a little more rest</p>

          <div className="flex gap-2">
            {[0.5, 1].map((v) => (
              <button
                key={v}
                onClick={() => {
                  if (sleepBoost === v) {
                    resetAll();
                    onReset();
                  } else {
                    resetAll();
                    setSleepBoost(v);
                
                    onSimulate(
                      simulateDelta({
                        sleepMinutes: v * 60,
                      })
                    );
                  }
                }}
                
                className={`flex-1 py-2 rounded-xl text-sm transition border ${
                  sleepBoost === v
                    ? "bg-white text-black border-white"
                    : "border-white/20 text-white hover:border-white/40"
                }`}
              >
                +{v * 60} min
              </button>
            ))}
          </div>
        </div>

        {/* WORK */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold mb-1">⏰ Work</p>
            <p className="text-xs text-white/60">
              Call it a day a bit earlier
            </p>
          </div>

          <button
            onClick={() => {
              if (endEarly) {
                resetAll();
                onReset();
              } else {
                resetAll();
                setEndEarly(true);
            
                onSimulate(
                  simulateDelta({
                    workEarly: true,
                  })
                );
              }
            }}
            
            className={`mt-4 py-2 rounded-xl text-sm transition border ${
              endEarly
                ? "bg-white text-black border-white"
                : "border-white/20 text-white hover:border-white/40"
            }`}
          >
            End work 1 hour early
          </button>
        </div>

        {/* BREAK */}
        <div className="p-4 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between">
          <div>
            <p className="text-sm font-semibold mb-1">☕ Break</p>
            <p className="text-xs text-white/60">Add one proper break</p>
          </div>

          <button
            onClick={() => {
              if (extraBreak) {
                resetAll();
                onReset();
              } else {
                resetAll();
                setExtraBreak(true);
            
                onSimulate(
                  simulateDelta({
                    breakMinutes: 15,
                  })
                );
              }
            }}
            
            className={`mt-4 py-2 rounded-xl text-sm transition border ${
              extraBreak
                ? "bg-white text-black border-white"
                : "border-white/20 text-white hover:border-white/40"
            }`}
          >
            Add one real break
          </button>
        </div>
      </div>

      {/* RESET */}
      <button
        onClick={() => {
          resetAll();
          onReset();
        }}
        className="mt-4 text-xs text-white/60 hover:text-white underline"
      >
        Reset preview
      </button>

      {/* RESULT */}
      <div
        className={`mt-8 p-6 rounded-2xl border ${
          improved
            ? "border-emerald-400/40 bg-emerald-500/10"
            : "border-rose-400/40 bg-rose-500/10"
        }`}
      >
        <p className="text-xs uppercase tracking-wide text-white/60 mb-2">
          if you keep doing this
        </p>

        <div className="flex items-center justify-between">
          <div>
          <p className="text-sm">
            Current pressure feels like{" "}
            <span className="font-semibold">
              {scoreToShow.risk}%
            </span>
         </p>

            <p className="text-sm text-white/60">
            {scoreToShow.driftVelocity > 0
              ? "Things are still adding up, but slower than before"
              : "Pressure is finally easing a little"}
            </p>
          </div>

          <div className="text-4xl font-bold">
            {improved ? "↓" : "↑"}
          </div>
        </div>

        <p className="mt-3 text-sm text-white/70">
          {scoreToShow.driftVelocity > 1
            ? "This helps a bit, but you might still feel tired after a few days."
            : scoreToShow.driftVelocity > 0
            ? "This is stopping things from getting worse."
            : "This gives your mind and body some breathing space."}
</p>

      </div>
    </div>
  );
}



