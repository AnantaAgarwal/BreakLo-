"use client";

type Point = {
  date: string;
  risk: number;
};

export function DriftTimeline({ data }: { data: Point[] }) {
  if (!data || data.length === 0) return null;

  const width = 420;
  const height = 200;
  const padding = 32;

  const safeLength = Math.max(data.length, 2);
  const xStep = (width - padding * 2) / (safeLength - 1);

  const getX = (i: number) => padding + i * xStep;
  const getY = (risk: number) =>
    height - padding - (risk / 100) * (height - padding * 2);

  const path =
    data.length > 1
      ? data
          .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p.risk)}`)
          .join(" ")
      : "";

  const startRisk = data[0].risk;
  const endRisk = data[data.length - 1].risk;

  const direction =
    endRisk > startRisk ? "up" : endRisk < startRisk ? "down" : "flat";

  return (
    <div
      className="
        rounded-3xl border border-white/10
        p-6 bg-gradient-to-br from-white/5 to-white/[0.02]
        backdrop-blur-xl
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm uppercase tracking-wide text-gray-400">
          Last 7 days
        </p>

        <span className="text-lg">
          {direction === "up" && "↑"}
          {direction === "down" && "↓"}
          {direction === "flat" && "→"}
        </span>
      </div>

      {/* GRAPH */}
      <svg width={width} height={height} className="block mx-auto">
        <defs>
          <linearGradient id="riskZone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7f1d1d" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="strainZone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#78350f" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="stableZone" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#064e3b" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#064e3b" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* ZONE BANDS */}
        <rect x="0" y="0" width={width} height={height * 0.33} fill="url(#riskZone)" />
        <rect
          x="0"
          y={height * 0.33}
          width={width}
          height={height * 0.33}
          fill="url(#strainZone)"
        />
        <rect
          x="0"
          y={height * 0.66}
          width={width}
          height={height * 0.34}
          fill="url(#stableZone)"
        />

        {/* LINE */}
        {path && (
          <path
            d={path}
            fill="none"
            stroke="#f8fafc"
            strokeWidth="2.6"
            strokeLinecap="round"
          />
        )}

        {/* POINTS */}
        {data.map((p, i) => (
          <circle
            key={i}
            cx={getX(i)}
            cy={getY(p.risk)}
            r={4}
            fill="#f8fafc"
            stroke="#020617"
            strokeWidth="1"
          />
        ))}

        {/* TODAY */}
        <circle
          cx={getX(data.length - 1)}
          cy={getY(endRisk)}
          r={6}
          fill="#ffffff"
          stroke="#000"
          strokeWidth="1.5"
        />

        <text
          x={getX(data.length - 1)}
          y={getY(endRisk) - 10}
          textAnchor="middle"
          fontSize="10"
          fill="#e5e7eb"
        >
          Today
        </text>
      </svg>

      {/* FOOTER */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>{data[0].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>

      <p className="mt-2 text-sm text-white/70">
        Dots show each day. The line shows how strain slowly builds or eases.
      </p>
    </div>
  );
}


