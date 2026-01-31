"use client";

import { useEffect, useState } from "react";
import { auth, db } from "../lib/firebase";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { computeScores } from "../lib/scoring";
import { useRouter } from "next/navigation";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function Home() {
  const [user, setUser] = useState<any>(null);

  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    return auth.onAuthStateChanged(setUser);
  }, []);

  const router = useRouter();

  const login = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const saveLog = async () => {
    if (!user) return;

    const date = new Date().toISOString().split("T")[0];

    const logData = {
      workStart: (document.getElementById("workStart") as HTMLInputElement).value,
      workEnd: (document.getElementById("workEnd") as HTMLInputElement).value,
      breakMinutes: Number(
        (document.getElementById("breakMinutes") as HTMLInputElement).value
      ),
      sleepHours: Number(
        (document.getElementById("sleepHours") as HTMLInputElement).value
      ),
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, "users", user.uid, "logs", date), logData);

    const scores = computeScores(logData);

    await addDoc(collection(db, "users", user.uid, "scores"), {
      ...scores,
      createdAt: serverTimestamp(),
      day: date,
    });

    setAnalyzing(true);

    setTimeout(() => {
      router.push("/dashboard");
      }, 2200);

  };

  return (
    <main className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">

{analyzing && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur flex items-center justify-center z-50 text-white">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>

      <p className="text-lg font-medium">
        Checking how your day went...
      </p>

      <p className="text-sm text-white/60">
        Looking at work, breaks & recovery
      </p>
    </div>
  </div>
)}


      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-black animate-gradient" />

      {/* Floating blobs */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />

      {/* Card */}
      <div className="relative w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-8 shadow-2xl">

        {/* Heading */}
        <h1 className="text-3xl font-bold">BreakLo</h1>

        <p className="mt-3 text-sm text-white/70 leading-relaxed">
          Burnout doesn’t hit suddenly.  
          It builds quietly when recovery keeps falling behind.
        </p>

        {!user ? (
          <button
            className="mt-8 w-full py-3 rounded-xl bg-white text-black font-medium hover:scale-[1.02] transition"
            onClick={login}
          >
            Continue with Google →
          </button>
        ) : (
          <div className="mt-6 space-y-4">

            <p className="text-sm text-white/60">
              Logged in as <span className="text-white">{user.email}</span>
            </p>

            <label className="text-xs text-white/50">
              🕒 When did your work start?
            </label>
            <input
              id="workStart"
              type="time"
              className="input-field"
            />

            <label className="text-xs text-white/50">
              🛑 When did work end?
            </label>
            <input
              id="workEnd"
              type="time"
              className="input-field"
            />

            <label className="text-xs text-white/50">
              ☕ Break time today (minutes)
            </label>
            <input
              id="breakMinutes"
              type="number"
              placeholder="ex: 30"
              className="input-field"
            />

            <label className="text-xs text-white/50">
              😴 Last night's sleep (hours)
            </label>
            <input
              id="sleepHours"
              type="number"
              placeholder="ex: 7"
              className="input-field"
            />

            <button
              className="w-full bg-white text-black py-3 rounded-xl mt-4 font-medium hover:scale-[1.02] transition"
              onClick={saveLog}
            >
              Save today & see my status →
            </button>

            <button
              className="w-full border border-white/20 py-2 rounded-xl hover:bg-white/10 transition"
              onClick={logout}
            >
              Logout
            </button>

          </div>
        )}
      </div>
    </main>
  );
}



