"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Trophy, User, Settings } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: "LEARN", icon: BookOpen, href: "/" },
    { label: "LEADERBOARDS", icon: Trophy, href: "/leaderboard" },
    { label: "PROFILE", icon: User, href: "/profile" },
    { label: "SETTINGS", icon: Settings, href: "/settings" },
  ];

  return (
    <aside className="fixed left-0 top-0 hidden md:flex h-full w-64 flex-col border-r-2 theme-sidebar px-4 py-6 z-20 transition-colors">
      <div className="mb-8 px-4 flex items-center gap-2">
        <h1 className="text-3xl font-extrabold tracking-wider text-[#58cc02]">duolingo</h1>
      </div>

      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm tracking-wide transition-colors ${
                isActive
                  ? "bg-[#ddf4ff] text-[#1cb0f6] border-2 border-[#84d8ff]"
                  : "text-[#777777] hover:bg-gray-100"
              }`}
            >
              <Icon className="w-6 h-6" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}