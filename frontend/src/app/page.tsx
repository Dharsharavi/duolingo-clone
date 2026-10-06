"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Star, Lock } from "lucide-react";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";

interface Lesson {
  id: number;
  title: string;
  order: number;
  status: "COMPLETED" | "ACTIVE" | "LOCKED";
}

interface Unit {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface UserProfile {
  xp: number;
  username: string;
  hearts: number;
  streak: number;
  gems: number;
}

export default function HomePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, unitsRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/user"),
          fetch("http://127.0.0.1:8000/api/units"),
        ]);

        const userData = await userRes.json();
        const unitsData = await unitsRes.json();

        setUser(userData);
        setUnits(unitsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">
        Loading Duolingo...
      </div>
    );
  }

  const offsets = [0, 45, 65, 35, 0, -35, -65, -45];

  return (
    <div className="min-h-screen bg-white">
      <Sidebar />
      <TopBar streak={user.streak} gems={user.gems} hearts={user.hearts} />

      <main className="md:ml-64 pt-20 pb-24 flex flex-col items-center">
        {units.map((unit) => (
          <div key={unit.id} className="w-full max-w-xl px-4 flex flex-col items-center">
            {/* Unit Header Banner */}
            <div className="w-full bg-[#58cc02] text-white p-5 rounded-2xl mb-12 shadow-sm">
              <span className="text-xs uppercase font-extrabold tracking-wider opacity-90">
                Unit {unit.order}
              </span>
              <h2 className="text-xl font-extrabold mt-1">{unit.title}</h2>
              <p className="text-sm font-semibold opacity-95 mt-1">{unit.description}</p>
            </div>

            {/* Path Nodes */}
            <div className="flex flex-col items-center gap-6 w-full">
              {unit.lessons.map((lesson, idx) => {
                const offsetX = offsets[idx % offsets.length];
                const isCompleted = lesson.status === "COMPLETED";
                const isActive = lesson.status === "ACTIVE";
                const isLocked = lesson.status === "LOCKED";

                return (
                  <div
                    key={lesson.id}
                    className="relative flex flex-col items-center"
                    style={{ transform: `translateX(${offsetX}px)` }}
                  >
                    {/* Tooltip for Active Lesson */}
                    {isActive && (
                      <div className="absolute -top-10 bg-white border-2 border-gray-200 text-[#58cc02] font-black text-xs px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-md animate-bounce whitespace-nowrap z-10">
                        Start +10 XP
                        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 border-solid border-t-white border-t-8 border-x-transparent border-x-8 border-b-0" />
                      </div>
                    )}

                    {isLocked ? (
                      <div className="w-20 h-20 rounded-full btn-3d-gray flex items-center justify-center">
                        <Lock className="w-8 h-8 text-[#afafaf]" />
                      </div>
                    ) : (
                      <Link
                        href={`/lesson/${lesson.id}`}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-transform hover:scale-105 ${
                          isCompleted
                            ? "bg-[#ffc800] border-b-4 border-[#e5a500] text-white"
                            : "btn-3d-green"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="w-10 h-10 stroke-[3]" />
                        ) : (
                          <Star className="w-10 h-10 fill-white" />
                        )}
                      </Link>
                    )}

                    <span className="text-xs font-bold text-gray-500 mt-2">
                      {lesson.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}