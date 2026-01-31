"use client";

import { useState } from "react";

type Props = {
  score: any;
  log: any;
};

export function WhyThisHappened({ score, log }: Props) {
  const [open, setOpen] = useState(false);
  const explanation = getExplanation(score, log);

  return (
    <div className="mt-10">
      {/* TOGGLE HEADER */}
      <button
        onClick={() => setOpen(!open)}
        className="
          w-full flex items-center justify-between px-6 py-4 rounded-2xl
          border border-white/10
          bg-gradient-to-br from-slate-950 via-black to-slate-900
          hover:border-white/20
          transition-all duration-300
          shadow-xl
        "
      >
        <div className="text-left">
          <p className="text-sm font-semibold text-white">
            What’s going on here?
          </p>
          <p className="text-xs text-white/60">
            Just patterns from your routine
          </p>
        </div>

        <div
          className={`text-xl transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        >
          ⌄
        </div>
      </button>

      {/* COLLAPSIBLE BODY */}
      <div
        className={`overflow-hidden transition-all duration-500 ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className="
            mt-3 p-6 rounded-2xl
            border border-white/10
            bg-gradient-to-br from-slate-950/80 via-black/70 to-slate-900/80
            backdrop-blur-xl
            shadow-2xl
          "
        >
          <p className="text-sm text-white/80 leading-relaxed">
            {explanation}
          </p>

          <div className="mt-4 text-xs text-white/50">
            This looks only at time patterns — no moods, no messages, no personal data.
          </div>
        </div>
      </div>
    </div>
  );
}

function getExplanation(score: any, log: any) {
  const reasons: string[] = [];

  if (log.workHours > 9) {
    reasons.push("your workdays quietly started running longer");
  }

  if (log.sleepHours < 7) {
    reasons.push("sleep didn’t really catch up");
  }

  if (log.breakMinutes < 30) {
    reasons.push("breaks became quick or easy to skip");
  }

  if (reasons.length === 0) {
    return (
      "Your routine stayed fairly steady this week. Work and recovery are still moving together, which is a good sign."
    );
  }

  return (
    "Nothing dramatic happened. Over a few days, " +
    reasons.join(" and ") +
    ". Small gaps like this slowly add pressure — even when things feel normal."
  );
}
