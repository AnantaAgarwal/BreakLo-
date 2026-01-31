"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { auth, db } from "../../lib/firebase";

import { DriftTimeline } from "../components/DriftTimeline";
import { WhyThisHappened } from "../components/WhyThisHappened";
import { WhatIfSimulator } from "../components/WhatIfSimulator";
import { RecoveryRing } from "../components/RecoveryRing";
import { RiskRing } from "../components/RiskRing";
import { MinimumEffectiveRecovery } from "../components/MinimumEffectiveRecovery";

import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

import { onAuthStateChanged } from "firebase/auth";

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const [actualScore, setActualScore] = useState<any>(null);
  const [previewScore, setPreviewScore] = useState<any>(null);
  const [isPreviewOn, setIsPreviewOn] = useState(false);

  const [trend, setTrend] = useState<any[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);

  const [splashIntro, setSplashIntro] = useState(true);

  const [introStep, setIntroStep] = useState(0);



  // 🔐 Auth + fetch latest score
  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setData(null);
        return;
      }

      setUser(u);

      const q = query(
        collection(db, "users", u.uid, "scores"),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snap = await getDocs(q);

      if (!snap.empty) {
        const latest = snap.docs[0].data();
        setData(latest);
        setActualScore(latest);
        setIsPreviewOn(false);
        fetchTrend(u);
      }
    });
  }, []);

  
  useEffect(() => {
    const t = setTimeout(() => {
      setSplashIntro(false);
    }, 2000);
  
    return () => clearTimeout(t);
  }, []);
  
  useEffect(() => {
    const steps = [400, 900, 1400, 1900, 2400];
  
    steps.forEach((delay, index) => {
      setTimeout(() => {
        setIntroStep(index + 1);
      }, delay);
    });
  }, []);
  

  // 📈 Last 7 days trend
  const fetchTrend = async (user: any) => {
    const q = query(
      collection(db, "users", user.uid, "scores"),
      orderBy("createdAt", "asc"),
      limit(7)
    );

    const snap = await getDocs(q);

    const points = snap.docs.map((doc) => ({
      date: doc.data().day ?? doc.id,
      risk: doc.data().risk,
    }));

    setTrend(points);
  };

  // 🔁 Preview handlers
  const handleSimulate = useCallback((simulated: any) => {
    setPreviewScore(simulated);
    setIsPreviewOn(true);
  }, []);

  const handleReset = useCallback(() => {
    setIsPreviewOn(false);
    setPreviewScore(null);
  }, []);

  const activeScore =
    isPreviewOn && previewScore ? previewScore : actualScore;

    


  // ---------------- Guards ----------------

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        Please log in to view your dashboard
      </div>
    );
  }

  if (!data || !activeScore) {
    return <div className="text-white">Loading dashboard…</div>;
  }

  // ---------------- UI ----------------

  return (
    <main className="
      min-h-screen
      text-white
      px-8 py-10
      bg-[radial-gradient(ellipse_at_top,_#1f2937_0%,_#020617_55%,_#000000_100%)]
    ">
    
    <section
  ref={heroRef}
  className={`
    min-h-screen flex flex-col items-center justify-center
    text-center px-6 transition-all duration-700
    ${
      activeScore.zone === "Risk Zone"
        ? "bg-gradient-to-br from-rose-800 via-black to-rose-950"
        : activeScore.zone === "Strain Zone"
        ? "bg-gradient-to-br from-amber-700 via-black to-amber-950"
        : "bg-gradient-to-br from-emerald-700 via-black to-emerald-950"
    }
    ${splashIntro ? "scale-110 opacity-0" : "scale-100 opacity-100"}
  `}
>
<div
  className="text-8xl mb-6 transition-transform duration-300"
>
    {activeScore.zone === "Risk Zone"
      ? "🔥"
      : activeScore.zone === "Strain Zone"
      ? "⚡"
      : "🌿"}
  </div>

  <h1 className="text-6xl font-bold mb-6">
    {activeScore.zone}
  </h1>

  <p className="max-w-xl text-lg text-white/80">
    {activeScore.zone === "Risk Zone"
      ? "You’ve been carrying a lot lately. Recovery hasn’t caught up yet."
      : activeScore.zone === "Strain Zone"
      ? "Things are manageable, but pressure is still building slowly."
      : "Things feel steady. Your effort and recovery are in balance."}
  </p>

  <p className="mt-16 text-white/50 text-sm animate-bounce">
    Scroll to see your dashboard ↓
  </p>

  <div className="absolute inset-0 overflow-hidden pointer-events-none">
  {[...Array(25)].map((_, i) => (
    <span
      key={i}
      className={`
        absolute w-2 h-2 rounded-full opacity-20 animate-float
        ${
          activeScore.zone === "Risk Zone"
            ? "bg-rose-400"
            : activeScore.zone === "Strain Zone"
            ? "bg-amber-300"
            : "bg-emerald-300"
        }
      `}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDelay: `${Math.random() * 5}s`,
      }}
    />
  ))}
</div>

</section>


      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <h1 className="text-3xl font-semibold">
          Hey 👋 quick check-in
        </h1>
        <p className="text-white/60 mt-1">
          No judgement. Just a quick look at how things are going.
        </p>

        {/* HERO */}
        <div
          ref={heroRef}
          className={ `
            mt-10 p-10 rounded-[32px] border
            transition-all duration-700
            ${introStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
            bg-gradient-to-br
              activeScore.zone === "Risk Zone"
                ? "from-rose-900/40 to-rose-950/70 border-rose-500/40"
                : activeScore.zone === "Strain Zone"
                ? "from-amber-900/40 to-amber-950/70 border-amber-500/40"
                : "from-emerald-900/40 to-emerald-950/70 border-emerald-500/40"
            }
          `}
        >
          <p className="text-xs uppercase tracking-widest text-white/60">
            Right now
          </p>

          <h2 className="mt-2 text-4xl font-bold">
            {activeScore.zone}
          </h2>

          <p className="mt-2 text-white/80 max-w-xl">
            {activeScore.zone === "Risk Zone"
              ? "You’ve been pushing hard lately. Rest hasn’t caught up yet."
              : activeScore.zone === "Strain Zone"
              ? "You’re managing, but the pressure is still there."
              : "Things feel steady. Your effort and recovery are balanced."}
          </p>

          <div className="mt-6">
            <MinimumEffectiveRecovery
              score={activeScore}
              log={{
                sleepHours: data.sleepHours,
                breakMinutes: data.breakMinutes,
                workHours: data.workHours,
              }}
            />
          </div>
        </div>

        {/* SECONDARY */}
        <div className="mt-14 space-y-10">
        <div
  className={`
    grid md:grid-cols-2 gap-6
    transition-all duration-700
    ${introStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
  `}
>

            <div className="
  p-6 rounded-3xl
  backdrop-blur-xl bg-white/5
  border border-white/10
  transition-all duration-500
  hover:scale-[1.02]
  hover:bg-white/10
"
>
              <p className="text-sm text-white/60 mb-2">
                Current pressure 🔥
              </p>
              <RiskRing value={activeScore.risk} />
            </div>

            <div className="
  p-6 rounded-3xl
  backdrop-blur-xl bg-white/5
  border border-white/10
  transition-all duration-500
  hover:scale-[1.02]
  hover:bg-white/10
"
>
              <p className="text-sm text-white/60 mb-2">
                Energy you still have ⚡
              </p>
              <RecoveryRing value={activeScore.rci} />
            </div>
          </div>

          {trend.length > 0 && (
  <div
    className={`
      transition-all duration-700
      ${introStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
    `}
  >
    <DriftTimeline data={trend} />
  </div>
)}

<div
  className={`
    transition-all duration-700
    ${introStep >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}
  `}></div>


        
          <WhatIfSimulator
            baseLog={{
              sleepHours: data.sleepHours,
              breakMinutes: data.breakMinutes,
              workEnd: data.workEnd,
            }}
            baseScore={actualScore}
            previewScore={isPreviewOn ? activeScore : null}
            onSimulate={handleSimulate}
            onReset={handleReset}
          />

          <WhyThisHappened
            score={data}
            log={{
              workHours: (data.workMinutes || 540) / 60,
              sleepHours: data.sleepHours,
              breakMinutes: data.breakMinutes,
            }}
          />
        </div>
      </div>

      {/* 🌟 IDEA 1 — STICKY PREVIEW MODE BAR */}
      {isPreviewOn && (
        <div className="
          fixed bottom-4 left-1/2 -translate-x-1/2
          bg-black/75 backdrop-blur-xl
          border border-white/15
          rounded-2xl px-6 py-4
          flex items-center gap-4
          shadow-2xl z-50
        ">
          <p className="text-sm text-white/80">
            You’re previewing a small change — here’s how it affects your day
          </p>

          <button
            onClick={() =>
              heroRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="text-sm text-emerald-400 hover:text-emerald-300"
          >
            See changes ↑
          </button>

          <button
            onClick={handleReset}
            className="text-sm text-white/50 hover:text-white"
          >
            Reset
          </button>
        </div>
      )}
    </main>
  );
}

