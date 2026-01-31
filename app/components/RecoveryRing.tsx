"use client";

export function RecoveryRing({ value }: { value: number }) {
  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  // calmer, hopeful colors
  const color =
    value < 25
      ? "#ef4444" // critically low
      : value < 50
      ? "#f59e0b" // running low
      : "#22c55e"; // healthy

  return (
    <svg width="120" height="120">
      {/* background track */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke="#1f2937"
        strokeWidth="8"
        fill="none"
      />

      {/* active ring */}
      <circle
        cx="60"
        cy="60"
        r={radius}
        stroke={color}
        strokeWidth="8"
        fill="none"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{
          filter: "drop-shadow(0 0 10px currentColor)",
          transition: "stroke-dashoffset 0.6s ease",
        }}
      />

      {/* center text */}
      <text
        x="50%"
        y="48%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="18"
        fontWeight="bold"
      >
        {value}%
      </text>

      <text
        x="50%"
        y="62%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill="#9ca3af"
        fontSize="10"
      >
        left
      </text>
    </svg>
  );
}
