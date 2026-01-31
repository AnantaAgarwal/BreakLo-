"use client";

type Props = {
  driftVelocity: number;
};

export function DriftVelocityIndicator({ driftVelocity }: Props) {
  const improving = driftVelocity < 0;
  const flat = driftVelocity === 0;

  return (
    <div
      className={`
        p-6 rounded-3xl border
        ${
          improving
            ? "bg-emerald-900/30 border-emerald-400/40 shadow-[0_0_30px_#10b98140]"
            : flat
            ? "bg-slate-800/40 border-slate-500/30"
            : "bg-rose-900/30 border-rose-400/40 shadow-[0_0_30px_#fb718540]"
        }
      `}
    >
      <p className="text-xs uppercase tracking-wide text-white/60">
        Momentum
      </p>

      <div className="mt-2 flex items-center gap-4">
        <div className="text-5xl font-bold">
          {improving ? "↓" : flat ? "→" : "↑"}
        </div>

        <div>
          <p className="text-lg font-semibold">
            {improving
              ? "Recovery is catching up"
              : flat
              ? "Holding steady"
              : "Risk is creeping up"}
          </p>

          <p className="text-sm text-white/60">
            {improving
              ? "Small fixes are working."
              : flat
              ? "This balance can tip either way."
              : `Worsening by ${driftVelocity}% per day.`}
          </p>
        </div>
      </div>
    </div>
  );
}
