"use client";

import { RiskRing } from "../components/RiskRing";

export default function DashboardUI({ score }: { score: any }) {
  return (
    <div className="space-y-6">

      {/* ===== HERO INSIGHT ===== */}
      <div className="rounded-3xl p-6 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-800 border border-white/10 shadow-xl">
        <p className="text-xs uppercase tracking-wide text-slate-400">
          Burnout Risk Overview
        </p>

        <div className="mt-4 flex items-center gap-6">
          <RiskRing value={score.risk} />

          <div className="space-y-2 text-sm">
            <p>
              <span className="text-slate-400">Risk:</span>{" "}
              <span className="font-semibold">{score.risk}%</span>
            </p>

            <p className="text-emerald-400">
              Recovery Capacity: {score.rci}%
            </p>

            <p className="text-amber-400">
              Drift: +{score.driftVelocity}% / day
            </p>

            <p
              className={`font-semibold ${
                score.zone === "Risk Zone"
                  ? "text-red-400"
                  : score.zone === "Strain Zone"
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {score.zone}
            </p>
          </div>
        </div>

        <p className="mt-4 text-xs text-slate-400">
          If behavior continues, risk may reach{" "}
          <span className="font-semibold text-white">
            {score.predictedIn3Days}%
          </span>{" "}
          in 3 days.
        </p>
      </div>

      {/* ===== MICRO ADVICE ===== */}
      <div className="rounded-2xl p-4 bg-slate-900/80 border border-white/10">
        <p className="text-sm font-semibold text-white">
          What this means
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {score.zone === "Risk Zone" &&
            "You are operating beyond recovery limits. Reduce work duration or increase breaks immediately."}

          {score.zone === "Strain Zone" &&
            "Early signs detected. Small recovery changes today prevent long-term burnout."}

          {score.zone === "Stable Zone" &&
            "Healthy recovery balance. Maintain current habits."}
        </p>
      </div>

    </div>
  );
}

