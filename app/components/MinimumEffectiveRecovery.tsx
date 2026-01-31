"use client";

type Props = {
  score: any;
  log: any;
};

export function MinimumEffectiveRecovery({ score, log }: Props) {
  const actions = getRecoveryActions(score, log);

  if (actions.length === 0) return null;

  return (
    <div className="mt-10 p-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-xl">
      <p className="text-sm font-semibold mb-1">
        Smallest fix that helps 🛠️
      </p>
      <p className="text-xs text-white/60 mb-4">
        You don’t need a reset. Just one nudge.
      </p>

      <div className="space-y-3">
        {actions.map((a, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-4 rounded-2xl
              bg-black/30 border border-white/10"
          >
            <div className="text-xl">{a.icon}</div>

            <div>
              <p className="text-sm font-medium">
                {a.title}
              </p>
              <p className="text-xs text-white/60 mt-1">
                {a.effect}
              </p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-white/50">
        Based on simple cause–effect rules. No motivation talk.
      </p>
    </div>
  );
}

function getRecoveryActions(score: any, log: any) {
  const actions: {
    icon: string;
    title: string;
    effect: string;
  }[] = [];

  // Priority 1: Sleep
  if (log.sleepHours < 7) {
    actions.push({
      icon: "😴",
      title: "Add 45 minutes of sleep",
      effect:
        "This alone can slow burnout drift within 2–3 days.",
    });
  }

  // Priority 2: Work hours
  if (actions.length < 2 && log.workHours > 9) {
    actions.push({
      icon: "⏰",
      title: "End work one hour earlier",
      effect:
        "Prevents recovery debt from stacking up.",
    });
  }

  // Priority 3: Breaks
  if (actions.length < 2 && log.breakMinutes < 30) {
    actions.push({
      icon: "☕",
      title: "Take one real break",
      effect:
        "Helps recovery catch up without changing your schedule.",
    });
  }

  return actions;
}
