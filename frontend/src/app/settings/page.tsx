"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { Settings, Bell, Shield, Volume2, Sun } from "lucide-react";

export default function SettingsPage() {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Default is dark. Check if the user explicitly enabled light mode.
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLightMode(true);
      document.documentElement.classList.add("light");
    } else {
      setIsLightMode(false);
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleLightMode = () => {
    if (isLightMode) {
      // Revert to default Dark theme
      document.documentElement.classList.remove("light");
      localStorage.setItem("theme", "dark");
      setIsLightMode(false);
    } else {
      // Switch to Light Mode
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
      setIsLightMode(true);
    }
  };

  return (
    <div className="min-h-screen bg-white transition-colors duration-200">
      <Sidebar />
      <main className="md:ml-64 pt-12 pb-24 flex flex-col items-center px-4">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-8 h-8 text-gray-700" />
            <h1 className="text-2xl font-black text-gray-800">Preferences & Settings</h1>
          </div>

          <div className="border-2 border-gray-200 rounded-2xl divide-y-2 divide-gray-100 overflow-hidden bg-white">
            {/* Light Mode Toggle */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="w-6 h-6 text-[#ffc800]" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Light Mode</h4>
                  <p className="text-xs text-gray-400">
                    Switch from default dark theme to classic light theme
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={isLightMode}
                onChange={toggleLightMode}
                className="w-5 h-5 accent-[#58cc02] cursor-pointer"
              />
            </div>

            {/* Sound Effects */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Volume2 className="w-6 h-6 text-[#1cb0f6]" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Sound Effects & Audio</h4>
                  <p className="text-xs text-gray-400">Play celebratory sounds and text-to-speech audio</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#58cc02] cursor-pointer" />
            </div>

            {/* Daily Reminders */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-6 h-6 text-[#ff9600]" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Daily Reminders</h4>
                  <p className="text-xs text-gray-400">Remind me to protect my learning streak</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#58cc02] cursor-pointer" />
            </div>

            {/* Motivational Messages */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-6 h-6 text-[#58cc02]" />
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Motivational Messages</h4>
                  <p className="text-xs text-gray-400">Show friendly Duo animations between lessons</p>
                </div>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-[#58cc02] cursor-pointer" />
            </div>
          </div>

          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
            <p className="text-xs font-bold text-gray-400">
              Duolingo Clone v1.0.0 • All preferences saved locally
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}