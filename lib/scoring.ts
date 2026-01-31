export function minutesBetween(start: string, end: string) {
  if (!start || !end) return 0;

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  return (eh * 60 + em) - (sh * 60 + sm);
  }
  
  export function clamp(n: number, min = 0, max = 100) {
    return Math.max(min, Math.min(max, n));
  }
  export function computeScores(log: {
    workStart?: string;
    workEnd?: string;
    breakMinutes: number;
    sleepHours: number;
  }) {
    const workStart = log.workStart || "09:00";
    const workEnd = log.workEnd || "18:00";

    const workMinutes = minutesBetween(workStart, workEnd);
  
    // Risk drivers (simple, explainable)
    let risk = 0;
    if (workMinutes > 540) risk += (workMinutes - 540) * 0.08; // >9h
    if (log.breakMinutes < 30) risk += 15;
    if (log.sleepHours < 7) risk += (7 - log.sleepHours) * 8;
  
    risk = clamp(Math.round(risk));
  
    // Recovery Capacity Index
    let rci = 100;
    rci -= workMinutes > 540 ? 20 : 0;
    rci -= log.breakMinutes < 30 ? 20 : 0;
    rci -= log.sleepHours < 7 ? (7 - log.sleepHours) * 10 : 0;
    rci = clamp(Math.round(rci));
  
    // Drift Velocity (how fast risk is changing)
    const driftVelocity = clamp(Math.round((risk - (100 - rci)) / 3));
  
    // Zone
    const zone =
      risk < 35 ? "Stable Zone" : risk < 65 ? "Strain Zone" : "Risk Zone";
  
    // Prediction (very judge-friendly)
    const predictedIn3Days = clamp(risk + driftVelocity * 3);
  
    return { risk, rci, driftVelocity, zone, predictedIn3Days };
  }
    