# 🦉 Duolingo Web Clone

A full-stack, gamified language-learning platform inspired by Duolingo, built with **Next.js, TypeScript, Tailwind CSS, FastAPI, SQLAlchemy, and SQLite**.

![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?logo=next.js)
![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi)
![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?logo=python)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite)

---

## 📌 Overview

**Duolingo Web Clone** is a responsive full-stack language-learning application designed to recreate the core learning and gamification experience of Duolingo.

The application combines a playful learning interface with a functional backend that manages:

- 📚 Course and lesson progression
- 🎯 Interactive exercises
- ❤️ Hearts and mistake mechanics
- 🔥 Daily streak tracking
- 💎 Gem-based heart refills
- ⭐ XP and lesson rewards
- 🏆 Competitive leaderboard
- 🔊 Audio and pronunciation support
- 🧪 Evaluator Sandbox for testing application behavior

The project features a **sinusoidal learning path**, a dynamic lesson player with five exercise types, real-time feedback, gamification mechanics, and persistent database-backed progress.

---

## ✨ Key Features

### 🎨 1. Duolingo-Inspired UI/UX
- **Signature Palette:** Green (`#58cc02`), Blue (`#1cb0f6`), Gold (`#ffc800`), and Red (`#ff4b4b`).
- **3D Physics Buttons:** Physical extruded feel with tactile click transforms (`active:translate-y-1`).
- **Sinusoidal Skill Tree:** Dynamic learning path with completion checkmarks, active glowing states, and locked milestones.
- **Dual Theme Support:** Custom Duolingo Night Theme (`#131f24`) as default, with an instant toggleable Light Theme.
- **Responsive Layout:** Adaptive desktop sidebar, top HUD, and fluid mobile navigation.

### 📚 2. Interactive Lesson Player
The engine supports five distinct exercise models with real-time feedback:

| Exercise Type | Description |
|---|---|
| `MULTIPLE_CHOICE` | Card-based single selection with instant validation |
| `TRANSLATION` | Dynamic word-bank sentence assembly |
| `LISTENING` | Auditory prompt playback with token reconstruction |
| `FILL_IN_BLANK` | In-sentence token slotting |
| `MATCHING_PAIRS` | Two-column interactive vocabulary pairing |

- **Real-Time Drawers:** Slide-up feedback panels (Green success / Red error with explicit correct answers).
- **Web Audio & TTS:** Native sound synthesizer for chimes/thuds and Web Speech API Text-to-Speech for foreign-language pronunciation.

### 🎮 3. Gamification System
- **Date-Aware Streak Engine:** Distinguishes between same-day practice (streak preserved), consecutive-day practice (+1 streak), and missed days (streak reset).
- **Hearts Mechanic:** 5-heart cap. Depleted upon incorrect answers. Reaching 0 triggers the Out-of-Hearts modal with an option to refill using gems (50 Gems = 5 Hearts).
- **Dynamic Leaderboard:** Seeded Bronze League ranking table that dynamically sorts and shifts the active user based on real-time XP gains.
- **Evaluator Sandbox:** Accessible on the Profile page to simulate yesterday (-1 day) active status, test broken streak conditions (-2 days), or reset demo data to Lesson 2 in one click.

---

## 🛠️ Tech Stack Used

- **Frontend:** Next.js 14+ (App Router), React 18+, TypeScript, Tailwind CSS, Lucide React Icons.
- **Backend:** Python 3.10+, FastAPI (Asynchronous Web Framework), SQLAlchemy ORM, Pydantic v2, Uvicorn.
- **Database:** SQLite (Relational, file-based persistence).
- **Sound & Speech:** Native HTML5 Web Audio API & Web Speech API (zero external runtime dependencies).

---

## 🚀 Live Demo

Live at :https://duolingo-clone-frontend-45cr.onrender.com

---

## 🏗️ Architecture Overview

The system follows a decoupled client-server architecture communicating over a RESTful JSON API:

```text
duolingo-clone/
├── backend/
│   ├── main.py              # FastAPI application, CORS middleware, and API endpoints
│   ├── database.py          # SQLite connection and SQLAlchemy session factory
│   ├── models.py            # Relational database models
│   ├── schemas.py           # Pydantic validation schemas
│   ├── seed.py              # Course, exercise, and user seeding script
│   └── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Sinusoidal Learning Path screen
│   │   │   ├── welcome/page.tsx  # Hero landing page
│   │   │   ├── lesson/[id]/      # Dynamic multi-exercise Lesson Player
│   │   │   ├── leaderboard/      # Bronze League rankings
│   │   │   ├── profile/          # User stats & Evaluator Sandbox
│   │   │   ├── settings/         # Preferences & Dark/Light mode toggle
│   │   │   ├── layout.tsx        # Global HTML shell & theme persistence script
│   │   │   └── globals.css       # Tailwind directives & Duolingo 3D button classes
│   │   └── components/
│   │       ├── Sidebar.tsx       # Desktop navigation bar
│   │       └── TopBar.tsx        # Heads-Up Display (Streak, Gems, Hearts)
│   └── package.json
└── README.md


