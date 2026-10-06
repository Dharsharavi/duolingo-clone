# 🦉 Duolingo Web Clone — Full-Stack Language Learning Platform

A responsive, authentic web clone of Duolingo built with Next.js (TypeScript & Tailwind CSS) on the frontend and FastAPI (Python, SQLAlchemy, SQLite) on the backend.

The application replicates Duolingo’s signature gamified experience—including the sinusoidal skill progression path, dynamic 5-type lesson player, real-time auditory/visual feedback, streak retention engine, heart mechanics, and an interactive Evaluator Sandbox for live testing.

---

## 🚀 Key Highlights & Implemented Features

1. Authentic Duolingo UI/UX:
   - Playful, colorful aesthetic matching Duolingo’s palette (#58cc02 green, #1cb0f6 blue, #ffc800 gold, #ff4b4b red).
   - 3D physical extruded button push physics (active:translate-y-1).
   - Sinusoidal "snake" curriculum path with dynamic tooltips and active glowing state.
   - Dual theme support: Duolingo Night Theme (Dark Mode baseline) with an instant toggleable Light Theme.
   - Branded Hero Landing Page (/welcome) with mascot flourishes and language trays.

2. Full-Featured Lesson Player (/lesson/:id):
   - 5 Distinct Exercise Types:
     - MULTIPLE_CHOICE: Radio/card single-choice selection.
     - TRANSLATION: Interactive word-bank sentence assembly.
     - LISTENING: Auditory prompt playback with token reconstruction.
     - FILL_IN_BLANK: Dynamic in-sentence token insertion.
     - MATCHING_PAIRS: 2-column vocabulary pairing with state validation.
   - Real-Time Slide-Up Animated Drawers: Success green / Error red with explicit correction hints.
   - Real Audio Integration: Native Web Audio synthesizer for chime/thud sound effects and Web Speech API Text-to-Speech (TTS) for natural foreign-language pronunciation.

3. Gamification & Mechanics Engine:
   - Day-Based Streak Retention: Date-aware streak validation ensuring consecutive daily logins grant +1, same-day logins preserve, and inactive gaps reset streaks.
   - Hearts System: 5-heart capacity. Incorrect attempts subtract 1 heart. Depleting all hearts triggers an Out-of-Hearts modal with the option to refill using gems (50 Gems = 5 Hearts).
   - Competitive Leaderboard: Seeded Bronze League ranking table that dynamically positions the active user among competitors based on real-time XP gains.
   - Evaluator Sandbox: Embedded in the Profile screen to allow evaluators to simulate yesterday (-1 day) active status, time-travel to test streak breaks (-2 days), or reset demo data to Lesson 2 in a single click.

---

## 🛠️ Tech Stack & Architecture Overview

- Frontend: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Lucide React Icons.
- Backend: FastAPI (Python 3.10+), SQLAlchemy ORM, Pydantic v2, Uvicorn, SQLite.
- State Management & Persistence: RESTful JSON API communicating with backend relational database, with client-side theme and preference persistence.

duolingo-clone/
├── backend/
│   ├── main.py              # FastAPI server & route handlers
│   ├── database.py          # SQLite engine & session management
│   ├── models.py            # SQLAlchemy relational models
│   ├── schemas.py           # Pydantic request/response validation schemas
│   ├── seed.py              # Database seeding script (Spanish course & progress)
│   └── requirements.txt     # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx          # Sinusoidal Learning Path screen
│   │   │   ├── welcome/page.tsx  # Hero landing page
│   │   │   ├── lesson/[id]/      # Interactive Lesson Player
│   │   │   ├── leaderboard/      # Bronze League rankings
│   │   │   ├── profile/          # Profile stats & Evaluator Sandbox
│   │   │   ├── settings/         # Preferences & Theme toggles
│   │   │   ├── layout.tsx        # Root HTML layout & theme script
│   │   │   └── globals.css       # Tailwind base & Duolingo 3D styling
│   │   └── components/
│   │       ├── Sidebar.tsx       # Desktop navigation bar
│   │       └── TopBar.tsx        # Streak, gems, and hearts header
│   └── package.json
└── README.md

---

## 🗄️ Relational Database Schema

Users
  ├── id (PK, Integer)
  ├── username (String, Unique)
  ├── streak (Integer, Default: 0)
  ├── xp (Integer, Default: 0)
  ├── gems (Integer, Default: 450)
  ├── hearts (Integer, Default: 5)
  └── last_active_date (Date)

Courses
  ├── id (PK, Integer)
  ├── title (String)
  └── code (String, e.g., "es")

Units
  ├── id (PK, Integer)
  ├── course_id (FK -> Courses.id)
  ├── unit_number (Integer)
  ├── title (String)
  └── description (String)

Lessons
  ├── id (PK, Integer)
  ├── unit_id (FK -> Units.id)
  ├── order (Integer)
  └── title (String)

Exercises
  ├── id (PK, Integer)
  ├── lesson_id (FK -> Lessons.id)
  ├── type (Enum: MULTIPLE_CHOICE, TRANSLATION, LISTENING, FILL_IN_BLANK, MATCHING_PAIRS)
  ├── prompt (String)
  ├── audio_text (String, Optional)
  ├── correct_answer (String)
  └── options_json (JSON String)

UserProgress
  ├── id (PK, Integer)
  ├── user_id (FK -> Users.id)
  ├── lesson_id (FK -> Lessons.id)
  └── status (Enum: LOCKED, ACTIVE, COMPLETED)

---

## 📡 Core API Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| GET | /api/user | Fetches active learner stats (streak, xp, hearts, gems). |
| POST | /api/user/refill-hearts | Spends 50 gems to restore hearts back to 5. |
| GET | /api/units | Retrieves all course units, lessons, and completion states. |
| GET | /api/lessons/{id} | Retrieves full exercise sequence for a given lesson. |
| POST | /api/lessons/{id}/complete | Submits lesson completion, awards +10 XP, advances path, and recalculates streak. |
| POST | /api/user/deduct-heart | Decrements 1 heart upon incorrect exercise attempt. |
| GET | /api/leaderboard | Fetches seeded league users sorted by XP. |
| POST | /api/sandbox/set-active-date | Shifts user activity date (-1 or -2 days) to test streak behavior. |
| POST | /api/sandbox/reset-demo | Re-seeds database to a pristine evaluation baseline. |

---

## ⚙️ Local Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- Git

### 1. Backend Setup
cd backend
python -m venv venv

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python seed.py
uvicorn main:app --reload --port 8000

Backend runs locally at: http://127.0.0.1:8000 (Interactive docs: http://127.0.0.1:8000/docs).

### 2. Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs locally at: http://localhost:3000.

---

## 🧪 Evaluator Verification Guide

1. Navigate to http://localhost:3000 to see the Sinusoidal Skill Tree with Lesson 1 marked COMPLETED and Lesson 2 pulsing with the active "Start +10 XP" badge.
2. Click Start +10 XP on Lesson 2:
   - Test deliberate mistakes to verify heart depletion and red correction drawer.
   - Complete the exercises to experience audio chimes, TTS pronunciation, and the celebratory XP summary modal.
3. Visit the Profile page:
   - Use the Assignment Evaluator Sandbox buttons to simulate day transitions and test streak logic without waiting 24 hours.
4. Visit Settings to toggle between the default Duolingo Night Theme and classic Light Theme.