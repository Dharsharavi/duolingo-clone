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

# ✨ Key Features

## 🎨 1. Duolingo-Inspired UI/UX

The interface follows a playful visual style inspired by Duolingo while maintaining a responsive and modern design.

### Highlights

- 🟢 Duolingo-inspired color palette
  - Green: `#58cc02`
  - Blue: `#1cb0f6`
  - Gold: `#ffc800`
  - Red: `#ff4b4b`
- 🎮 3D-style interactive buttons with press animations
- 🐍 Sinusoidal "snake" learning path
- ✨ Active lesson glowing state
- 🌙 Duolingo-inspired Night Theme
- ☀️ Toggleable Light Theme
- 🦉 Branded welcome/landing page
- 📱 Responsive layout
- 🧭 Sidebar and top navigation

---

## 📚 2. Interactive Lesson Player

The lesson player supports **five different exercise types**.

| Exercise Type | Description |
|---|---|
| `MULTIPLE_CHOICE` | Select the correct answer from multiple options |
| `TRANSLATION` | Build a translated sentence using a word bank |
| `LISTENING` | Listen to an audio prompt and reconstruct the answer |
| `FILL_IN_BLANK` | Complete missing words inside a sentence |
| `MATCHING_PAIRS` | Match vocabulary items between two columns |

### Lesson Experience

Each exercise provides:

- ✅ Immediate answer validation
- ❌ Incorrect-answer correction
- 🟢 Success feedback drawer
- 🔴 Error feedback drawer
- 🔊 Audio playback
- 🗣️ Text-to-Speech pronunciation
- 🎉 XP reward on lesson completion
- 📊 Progress through the exercise sequence

---

## 🎮 3. Gamification System

The application implements several core gamification mechanics.

### 🔥 Streak System

The streak engine is date-aware and handles:

- First-time activity
- Consecutive daily activity
- Multiple activities on the same day
- Inactive days
- Streak resets

### ❤️ Hearts System

Users begin with a maximum of **5 hearts**.

| Action | Result |
|---|---|
| Incorrect exercise | `-1 ❤️` |
| Maximum hearts | `5 ❤️` |
| Hearts reach 0 | Out-of-Hearts modal |
| Heart refill | `50 💎` |
| Successful refill | Hearts restored to `5` |

### ⭐ XP System

Completing a lesson awards:

```text
+10 XP
