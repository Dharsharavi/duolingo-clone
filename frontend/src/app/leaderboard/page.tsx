"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://duolingo-clone-ycq7.onrender.com";

interface LeaderboardUser {
  id: number;
  rank: number;
  username: string;
  xp: number;
  avatar: string;
  is_user: boolean;
}

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/leaderboard`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen theme-bg transition-colors duration-200">
      <Sidebar />
      <main className="md:ml-64 pt-12 pb-24 flex flex-col items-center px-4">
        <div className="w-full max-w-xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-[#ffc800] text-white flex items-center justify-center text-4xl shadow-md mb-3">
              🏆
            </div>
            <h1 className="text-3xl font-black theme-text-primary">Bronze League</h1>
            <p className="text-gray-400 font-bold text-sm mt-1">
              Top 3 advance to the Silver League next week!
            </p>
          </div>

          {/* Leaderboard Container */}
          <div className="border-2 rounded-3xl overflow-hidden divide-y-2 theme-card">
            {loading ? (
              <div className="p-8 text-center font-bold text-gray-400">
                Loading Leaderboard...
              </div>
            ) : (
              users.map((u) => {
                return (
                  <div
                    key={u.id}
                    className={`flex items-center justify-between px-6 py-4 transition-colors cursor-pointer ${
                      u.is_user ? "theme-user-row" : "theme-row-hover"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank Number */}
                      <span
                        className={`w-6 font-black text-lg ${
                          u.rank === 1
                            ? "text-[#ffc800]"
                            : u.rank === 2
                            ? "text-gray-400"
                            : u.rank === 3
                            ? "text-[#cd7f32]"
                            : "text-gray-500"
                        }`}
                      >
                        {u.rank}
                      </span>

                      {/* Avatar */}
                      <span className="text-2xl">{u.avatar}</span>

                      {/* Username */}
                      <span
                        className={`font-black text-sm tracking-wide ${
                          u.is_user ? "text-[#1cb0f6]" : "theme-text-primary"
                        }`}
                      >
                        {u.username} {u.is_user && "(You)"}
                      </span>
                    </div>

                    {/* XP Tag */}
                    <span className="font-extrabold text-sm text-gray-400">
                      {u.xp} XP
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
