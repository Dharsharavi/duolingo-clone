"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { X, Heart, CheckCircle2, XCircle, Volume2 } from "lucide-react";

// Synthesizes playful game sounds using browser Web Audio API
const playSound = (type: "correct" | "wrong" | "complete") => {
  if (typeof window === "undefined") return;
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === "correct") {
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1); // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  } else if (type === "wrong") {
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.15);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
    osc.start();
    osc.stop(ctx.currentTime + 0.35);
  } else if (type === "complete") {
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  }
};
const fetchUserData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/user");
      const data = await res.json();
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

const speakSpanish = (text: string) => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-ES";
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }
};

interface Exercise {
  id: number;
  order: number;
  type: "SELECT_ONE" | "TRANSLATE" | "MATCH_PAIRS" | "FILL_BLANK" | "TYPE_ANSWER";
  prompt: string;
  content: any;
}

interface LessonData {
  id: number;
  title: string;
  exercises: Exercise[];
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const lessonId = resolvedParams.id;

  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hearts, setHearts] = useState(5);
  const [loading, setLoading] = useState(true);

  // User input states
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [wordBankSelection, setWordBankSelection] = useState<string[]>([]);
  const [textInput, setTextInput] = useState("");
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // Status & Feedback bar states
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [isCompleted, setIsCompleted] = useState(false);
  const [isOutOfHearts, setIsOutOfHearts] = useState(false);

  useEffect(() => {
    async function fetchLesson() {
      try {
        const [lessonRes, userRes] = await Promise.all([
          fetch(`http://127.0.0.1:8000/api/lessons/${lessonId}`),
          fetch(`http://127.0.0.1:8000/api/user`)
        ]);

        if (!lessonRes.ok) throw new Error("Lesson not found");

        const lessonData = await lessonRes.json();
        const userData = await userRes.json();

        setLesson(lessonData);
        setHearts(userData.hearts);
      } catch (err) {
        console.error("Error loading lesson:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLesson();
  }, [lessonId]);

  if (loading || !lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-400">
        Loading Lesson...
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentIdx];
  const progressPercent = (currentIdx / lesson.exercises.length) * 100;

  // Handle checking answers
  const handleCheck = () => {
    let isCorrect = false;

    if (currentExercise.type === "SELECT_ONE" || currentExercise.type === "FILL_BLANK") {
      isCorrect = selectedOption === currentExercise.content.correct;
    } else if (currentExercise.type === "TRANSLATE") {
      const submitted = wordBankSelection.join(" ");
      const expected = currentExercise.content.correct.join(" ");
      isCorrect = submitted.trim().toLowerCase() === expected.trim().toLowerCase();
    } else if (currentExercise.type === "TYPE_ANSWER") {
      const allowed = currentExercise.content.correct.map((s: string) => s.trim().toLowerCase());
      isCorrect = allowed.includes(textInput.trim().toLowerCase());
    } else if (currentExercise.type === "MATCH_PAIRS") {
      isCorrect = matchedPairs.length === currentExercise.content.pairs.length;
    }

    if (isCorrect) {
      playSound("correct");
      setStatus("correct");
    } else {
      playSound("wrong");
      setStatus("wrong");
      const nextHearts = hearts - 1;
      setHearts(nextHearts);
      if (nextHearts <= 0) {
        setIsOutOfHearts(true);
      }
    }
  };

  // Move to next exercise or submit completion
  const handleContinue = async () => {
    if (currentIdx + 1 < lesson.exercises.length) {
      setCurrentIdx((prev) => prev + 1);
      setStatus("idle");
      setSelectedOption(null);
      setWordBankSelection([]);
      setTextInput("");
      setMatchedPairs([]);
      setSelectedLeft(null);
      setSelectedRight(null);
    } else {
      playSound("complete");
      await fetch(`http://127.0.0.1:8000/api/lessons/${lessonId}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hearts_left: hearts, xp_earned: 15 })
      });
      setIsCompleted(true);
    }
  };

  // Match Pairs selection helper
  const handlePairClick = (type: "left" | "right", item: string) => {
    if (status !== "idle") return;

    if (type === "left") {
      setSelectedLeft(item);
      if (selectedRight) {
        verifyPair(item, selectedRight);
      }
    } else {
      setSelectedRight(item);
      if (selectedLeft) {
        verifyPair(selectedLeft, item);
      }
    }
  };

  const verifyPair = (leftVal: string, rightVal: string) => {
    const pair = currentExercise.content.pairs.find(
      (p: any) => p.left === leftVal && p.right === rightVal
    );
    if (pair) {
      setMatchedPairs((prev) => [...prev, leftVal]);
    }
    setSelectedLeft(null);
    setSelectedRight(null);
  };

  // Check if button should be disabled
  const isSubmitDisabled = () => {
    if (status !== "idle") return false;
    if (currentExercise.type === "SELECT_ONE" || currentExercise.type === "FILL_BLANK") {
      return !selectedOption;
    }
    if (currentExercise.type === "TRANSLATE") {
      return wordBankSelection.length === 0;
    }
    if (currentExercise.type === "TYPE_ANSWER") {
      return textInput.trim().length === 0;
    }
    if (currentExercise.type === "MATCH_PAIRS") {
      return matchedPairs.length !== currentExercise.content.pairs.length;
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between select-none">
      {/* 1. Header Bar */}
      <header className="max-w-4xl mx-auto w-full pt-6 px-4 flex items-center gap-6">
        <button
          onClick={() => router.push("/")}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-7 h-7" />
        </button>

        {/* Progress Bar */}
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden">
          <div
            className="bg-[#58cc02] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Heart Count */}
        <div className="flex items-center gap-1.5 text-[#ff4b4b] font-extrabold text-base">
          <Heart className="w-7 h-7 fill-[#ff4b4b]" />
          <span>{hearts}</span>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="max-w-2xl mx-auto w-full px-4 flex-1 flex flex-col justify-center py-8">
        <div className="flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => speakSpanish(currentExercise.prompt)}
            className="p-3 bg-[#1cb0f6] text-white rounded-2xl border-b-4 border-[#1899d6] hover:bg-[#20b8ff] active:translate-y-1 transition-all"
            title="Listen to pronunciation"
          >
            <Volume2 className="w-6 h-6" />
          </button>
          <h2 className="text-2xl font-extrabold text-[#4b4b4b]">
            {currentExercise.prompt}
          </h2>
        </div>

        {/* EXERCISE TYPE: SELECT_ONE or FILL_BLANK */}
        {(currentExercise.type === "SELECT_ONE" || currentExercise.type === "FILL_BLANK") && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentExercise.content.options.map((option: string) => (
              <button
                key={option}
                onClick={() => status === "idle" && setSelectedOption(option)}
                className={`p-4 text-center font-bold text-lg rounded-2xl border-2 border-b-4 transition-all ${
                  selectedOption === option
                    ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6]"
                    : "border-gray-200 hover:bg-gray-50 text-[#4b4b4b]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* EXERCISE TYPE: TRANSLATE (Tap-the-words) */}
        {currentExercise.type === "TRANSLATE" && (
          <div className="flex flex-col gap-8">
            {/* Answer Tray */}
            <div className="min-h-16 border-b-2 border-gray-200 flex flex-wrap gap-2 items-center p-2">
              {wordBankSelection.map((word, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (status !== "idle") return;
                    setWordBankSelection((prev) => prev.filter((_, idx) => idx !== i));
                  }}
                  className="px-4 py-2 bg-white border-2 border-b-4 border-gray-200 rounded-xl font-bold text-gray-700 shadow-sm"
                >
                  {word}
                </button>
              ))}
            </div>

            {/* Word Bank Pool */}
            <div className="flex flex-wrap gap-2 justify-center">
              {currentExercise.content.tokens.map((word: string, i: number) => {
                const isUsed = wordBankSelection.includes(word);
                return (
                  <button
                    key={i}
                    disabled={isUsed || status !== "idle"}
                    onClick={() => setWordBankSelection((prev) => [...prev, word])}
                    className={`px-4 py-2 rounded-xl font-bold text-base transition-all ${
                      isUsed
                        ? "bg-gray-200 text-transparent border-2 border-gray-200 cursor-not-allowed"
                        : "btn-3d-white"
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* EXERCISE TYPE: TYPE_ANSWER */}
        {currentExercise.type === "TYPE_ANSWER" && (
          <div className="w-full">
            <textarea
              disabled={status !== "idle"}
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Type in Spanish..."
              className="w-full p-4 border-2 border-gray-200 rounded-2xl font-bold text-lg focus:outline-none focus:border-[#1cb0f6] resize-none h-32"
            />
          </div>
        )}

        {/* EXERCISE TYPE: MATCH_PAIRS */}
        {currentExercise.type === "MATCH_PAIRS" && (
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column */}
            <div className="flex flex-col gap-3">
              {currentExercise.content.pairs.map((p: any) => {
                const isMatched = matchedPairs.includes(p.left);
                const isSelected = selectedLeft === p.left;
                return (
                  <button
                    key={p.left}
                    disabled={isMatched || status !== "idle"}
                    onClick={() => handlePairClick("left", p.left)}
                    className={`p-3 font-bold rounded-xl border-2 border-b-4 transition-all ${
                      isMatched
                        ? "border-transparent bg-gray-100 text-gray-300 cursor-not-allowed"
                        : isSelected
                        ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6]"
                        : "btn-3d-white"
                    }`}
                  >
                    {p.left}
                  </button>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-3">
              {currentExercise.content.pairs.map((p: any) => {
                const isMatched = matchedPairs.includes(p.left);
                const isSelected = selectedRight === p.right;
                return (
                  <button
                    key={p.right}
                    disabled={isMatched || status !== "idle"}
                    onClick={() => handlePairClick("right", p.right)}
                    className={`p-3 font-bold rounded-xl border-2 border-b-4 transition-all ${
                      isMatched
                        ? "border-transparent bg-gray-100 text-gray-300 cursor-not-allowed"
                        : isSelected
                        ? "border-[#84d8ff] bg-[#ddf4ff] text-[#1cb0f6]"
                        : "btn-3d-white"
                    }`}
                  >
                    {p.right}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 3. The Signature Sliding Feedback Footer */}
      <footer
        className={`w-full border-t-2 py-6 px-4 transition-colors ${
          status === "correct"
            ? "bg-[#d7ffb8] border-[#b8f28b]"
            : status === "wrong"
            ? "bg-[#ffdfe0] border-[#fbc2c4]"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            {status === "correct" && (
              <div className="flex items-center gap-3 text-[#58a700]">
                <CheckCircle2 className="w-8 h-8 fill-[#58cc02] text-white" />
                <span className="text-xl font-extrabold">Nicely done!</span>
              </div>
            )}
            {status === "wrong" && (
              <div className="flex items-center gap-3 text-[#ea2b2b]">
                <XCircle className="w-8 h-8 fill-[#ff4b4b] text-white" />
                <div>
                  <span className="text-xl font-extrabold block">Incorrect</span>
                  <span className="text-sm font-semibold">Keep going, don't give up!</span>
                </div>
              </div>
            )}
          </div>

          {status === "idle" ? (
            <button
              disabled={isSubmitDisabled()}
              onClick={handleCheck}
              className={`px-8 py-3 uppercase tracking-wider text-sm font-extrabold ${
                isSubmitDisabled() ? "btn-3d-gray" : "btn-3d-green"
              }`}
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className={`px-8 py-3 uppercase tracking-wider text-sm font-extrabold ${
                status === "correct"
                  ? "btn-3d-green"
                  : "bg-[#ff4b4b] text-white border-b-4 border-[#ea2b2b] rounded-2xl"
              }`}
            >
              Continue
            </button>
          )}
        </div>
      </footer>

      {/* 4. Lesson Complete Modal */}
      {isCompleted && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center">
            <span className="text-6xl mb-4">🎉</span>
            <h2 className="text-2xl font-black text-[#58cc02]">Lesson Complete!</h2>
            <p className="text-gray-500 font-bold mt-2">You earned +15 XP!</p>
            <button
              onClick={() => router.push("/")}
              className="w-full mt-6 py-3.5 btn-3d-green uppercase tracking-wider"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* 5. Out of Hearts Modal */}
      {isOutOfHearts && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center">
            <span className="text-6xl mb-4">💔</span>
            <h2 className="text-2xl font-black text-[#ff4b4b]">Out of Hearts!</h2>
            <p className="text-gray-500 font-semibold mt-2">
              You need hearts to continue learning. Keep practicing to refill!
            </p>
            <button
              onClick={() => router.push("/")}
              className="w-full mt-6 py-3.5 btn-3d-blue uppercase tracking-wider"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}