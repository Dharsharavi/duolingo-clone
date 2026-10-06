"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Flame, Zap, Heart, Shield, RotateCcw } from "lucide-react";

interface UserProfile {
  xp: number;
  username: string;
  hearts: number;
  streak: number;
  gems: number;
  last_active: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user", {
        cache: "no-store",
      });
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <main className="md:ml-64 pt-12 pb-24 flex flex-col items-center px-4">
        <div className="w-full max-w-2xl">
          {/* User Profile Card */}
          <div className="flex items-center gap-6 pb-8 border-b-2 border-gray-200">
            <div className="w-24 h-24 rounded-full bg-[#58cc02] text-white flex items-center justify-center text-4xl font-black">
              🦉
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-800">{user.username}</h1>
              <p className="text-gray-400 font-bold text-sm">Joined October 2026</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xl">🇪🇸</span>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Spanish Course
                </span>
              </div>
            </div>
          </div>

          {/* Statistics Grid */}
          <h2 className="text-xl font-black text-gray-800 mt-8 mb-4">Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <Flame className="w-8 h-8 fill-[#ff9600] text-[#ff9600]" />
              <div>
                <span className="text-xl font-black text-gray-800 block">{user.streak}</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Day Streak</span>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <Zap className="w-8 h-8 fill-[#ffc800] text-[#ffc800]" />
              <div>
                <span className="text-xl font-black text-gray-800 block">{user.xp}</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Total XP</span>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <Shield className="w-8 h-8 text-[#1cb0f6] fill-[#1cb0f6]" />
              <div>
                <span className="text-xl font-black text-gray-800 block">Bronze</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Current League</span>
              </div>
            </div>

            <div className="border-2 border-gray-200 rounded-2xl p-4 flex items-center gap-4">
              <Heart className="w-8 h-8 fill-[#ff4b4b] text-[#ff4b4b]" />
              <div>
                <span className="text-xl font-black text-gray-800 block">{user.hearts} / 5</span>
                <span className="text-xs font-bold text-gray-400 uppercase">Hearts Left</span>
              </div>
            </div>
          </div>

          {/* Evaluator Testing Toolkit */}
          <div className="mt-10 p-6 bg-gray-50 border-2 border-dashed border-gray-300 rounded-3xl">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400 block mb-1">
              Assignment Evaluator Sandbox
            </span>
            <h3 className="text-base font-extrabold text-gray-800">
              Test Day-Based Streak & Demo Reset
            </h3>
            <p className="text-xs text-gray-500 font-semibold mt-1 mb-4">
              Click these buttons to test streak logic live, or reset the whole app back to a fresh demo state.
            </p>
            
            <div className="flex flex-col sm:flex-row flex-wrap gap-3">
              {/* Button 1: Yesterday (-1 Day) */}
              <button
                onClick={async () => {
                  await fetch("http://127.0.0.1:8000/api/user/simulate-day", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ days_to_advance: 1 }),
                  });
                  await fetchUserData();
                  alert("Simulated: Active yesterday! Complete any lesson now to increase streak by +1.");
                }}
                className="px-4 py-2.5 bg-white border-2 border-b-4 border-gray-200 rounded-xl font-bold text-xs text-gray-700 hover:bg-gray-100 active:translate-y-0.5"
              >
                Set Last Active = Yesterday (-1 Day)
              </button>

              {/* Button 2: Missed 2 Days */}
              <button
                onClick={async () => {
                  const res = await fetch("http://127.0.0.1:8000/api/user/simulate-day", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ days_to_advance: 2 }),
                  });
                  const data = await res.json();
                  // Force immediate local update
                  setUser((prev) => (prev ? { ...prev, streak: data.streak } : null));
                  alert("Simulated: Missed 2 days! Your Day Streak has broken and reset to 1.");
                }}
                className="px-4 py-2.5 bg-white border-2 border-b-4 border-gray-200 rounded-xl font-bold text-xs text-red-600 hover:bg-red-50 active:translate-y-0.5"
              >
                Set Last Active = 2 Days Ago (Breaks Streak)
              </button>

              {/* Button 3: Reset Demo Progress */}
              <button
                onClick={async () => {
                  await fetch("http://127.0.0.1:8000/api/user/reset-progress", {
                    method: "POST",
                  });
                  alert("Progress Reset! Lesson 1 is completed and Lesson 2 is Active.");
                  window.location.href = "/";
                }}
                className="px-4 py-2.5 bg-white border-2 border-b-4 border-gray-200 rounded-xl font-bold text-xs text-[#58cc02] hover:bg-green-50 active:translate-y-0.5 flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Demo Progress (Start at Lesson 2)
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}