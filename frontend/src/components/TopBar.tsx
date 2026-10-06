"use client";

import { useState } from "react";
import { Flame, Zap, Heart, Plus } from "lucide-react";

interface TopBarProps {
  streak: number;
  gems: number;
  hearts: number;
}

export default function TopBar({ streak, gems, hearts: initialHearts }: TopBarProps) {
  const [hearts, setHearts] = useState(initialHearts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refilling, setRefilling] = useState(false);

  const handleRefill = async () => {
    setRefilling(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user/refill-hearts", { method: "POST" });
      const data = await res.json();
      setHearts(data.hearts);
      setIsModalOpen(false);
      window.location.reload(); // Refresh to sync
    } catch (err) {
      console.error(err);
    } finally {
      setRefilling(false);
    }
  };

  return (
    <>
      <header className="fixed top-0 right-0 left-0 md:left-64 bg-white/90 backdrop-blur-md border-b-2 border-gray-200 h-16 z-10 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇪🇸</span>
          <span className="font-extrabold text-gray-500 uppercase tracking-wider text-xs">Spanish</span>
        </div>

        <div className="flex items-center gap-6 font-extrabold text-sm">
          {/* Streak */}
          <div className="flex items-center gap-1.5 text-[#ff9600]">
            <Flame className="w-6 h-6 fill-[#ff9600]" />
            <span>{streak}</span>
          </div>

          {/* Gems */}
          <div className="flex items-center gap-1.5 text-[#1cb0f6]">
            <Zap className="w-6 h-6 fill-[#1cb0f6]" />
            <span>{gems}</span>
          </div>

          {/* Clickable Heart Pill */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 text-[#ff4b4b] hover:bg-red-50 px-2 py-1 rounded-xl transition-all"
          >
            <Heart className="w-6 h-6 fill-[#ff4b4b]" />
            <span>{hearts}</span>
            <Plus className="w-4 h-4 ml-0.5 text-gray-400" />
          </button>
        </div>
      </header>

      {/* Refill Hearts Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center flex flex-col items-center">
            <Heart className="w-16 h-16 fill-[#ff4b4b] text-[#ff4b4b] mb-2 animate-bounce" />
            <h3 className="text-xl font-black text-gray-800">Hearts Refill</h3>
            <p className="text-sm font-semibold text-gray-500 mt-2">
              Refill your hearts to 5 so you never have to pause your learning streak!
            </p>

            <button
              onClick={handleRefill}
              disabled={refilling}
              className="w-full mt-6 py-3 btn-3d-blue flex items-center justify-center gap-2"
            >
              <span>{refilling ? "Refilling..." : "Refill All Hearts (-50 Gems)"}</span>
            </button>

            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-3 text-sm font-bold text-gray-400 hover:text-gray-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}