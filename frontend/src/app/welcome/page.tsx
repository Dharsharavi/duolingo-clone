"use client";

import Link from "next/link";
import { Globe, ArrowRight, Sparkles } from "lucide-react";

export default function WelcomePage() {
  const languages = [
    { name: "Spanish", flag: "🇪🇸" },
    { name: "French", flag: "🇫🇷" },
    { name: "German", flag: "🇩🇪" },
    { name: "Italian", flag: "🇮🇹" },
    { name: "Japanese", flag: "🇯🇵" },
    { name: "Chinese", flag: "🇨🇳" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between select-none">
      {/* 1. Header Bar */}
      <header className="max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-extrabold tracking-wider text-[#58cc02]">duolingo</span>
        </div>

        <div className="flex items-center gap-2 text-gray-400 font-extrabold text-sm hover:text-gray-600 cursor-pointer">
          <Globe className="w-5 h-5" />
          <span className="uppercase text-xs tracking-wider">Site Language: English</span>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-5xl mx-auto w-full px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 flex-1">
        {/* Mascot / Hero Visual */}
        <div className="flex flex-col items-center justify-center relative">
          <div className="w-64 h-64 sm:w-80 sm:h-80 rounded-full bg-[#f7f7f7] border-4 border-[#e5e5e5] flex items-center justify-center relative shadow-inner">
            <span className="text-9xl sm:text-[140px] animate-bounce select-none">🦉</span>
            <div className="absolute -top-3 -right-3 bg-[#ffc800] text-white p-3 rounded-2xl shadow-md rotate-12 flex items-center gap-1">
              <Sparkles className="w-5 h-5 fill-white" />
              <span className="text-xs font-black uppercase tracking-wider">Free Forever</span>
            </div>
          </div>
        </div>

        {/* Hero Slogan & Call-to-Actions */}
        <div className="max-w-md flex flex-col items-center lg:items-start text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#4b4b4b] leading-tight">
            The free, fun, and effective way to learn a language!
          </h1>
          <p className="text-gray-400 font-bold text-sm sm:text-base mt-4 mb-8">
            Bite-sized Spanish lessons that feel like a game. Master vocabulary, keep your streak alive, and climb the leagues.
          </p>

          <div className="w-full flex flex-col gap-3">
            <Link
              href="/?started=true"
              className="w-full py-4 text-center btn-3d-green text-sm uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </Link>

            
          </div>
        </div>
      </main>

      {/* 3. Language Carousel / Footer Tray */}
      <footer className="w-full border-t-2 border-gray-200 py-6 px-6 bg-white">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {languages.map((lang) => (
            <div
              key={lang.name}
              className="flex items-center gap-2 text-gray-400 font-extrabold text-xs uppercase tracking-wider hover:text-gray-600 cursor-pointer"
            >
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.name}</span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
