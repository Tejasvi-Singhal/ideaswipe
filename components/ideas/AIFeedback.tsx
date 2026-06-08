"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

type Feedback = {
  validationScore: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
};

type Props = {
  ideaId: string;
};

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 70
      ? "text-green-400"
      : score >= 40
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-slate-800 rounded-xl">
      <span className={`text-5xl font-bold ${color}`}>{score}</span>
      <span className="text-slate-400 text-sm mt-1">Validation Score</span>
      <div className="mt-2 w-full bg-slate-700 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${
            score >= 70
              ? "bg-green-400"
              : score >= 40
              ? "bg-yellow-400"
              : "bg-red-400"
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export default function AIFeedback({ ideaId }: Props) {
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function getFeedback() {
    setLoading(true);
    setError("");

    const response = await fetch(`/api/ideas/${ideaId}/validate`, {
      method: "POST",
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || "Something went wrong");
      setLoading(false);
      return;
    }

    setFeedback(data);
    setLoading(false);
  }

  if (!feedback) {
    return (
      <div className="bg-slate-900 border border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">🤖</span>
          <h3 className="text-white font-semibold">AI Idea Validation</h3>
        </div>
        <p className="text-slate-400 text-sm mb-4">
          Get instant AI feedback on your idea's strengths, weaknesses, and
          improvement suggestions.
        </p>
        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}
        <Button
          onClick={getFeedback}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white w-full"
        >
          {loading ? "Analyzing your idea..." : "✨ Validate with AI"}
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🤖</span>
        <h3 className="text-white font-semibold">AI Validation Results</h3>
      </div>

      <ScoreRing score={feedback.validationScore} />

      {/* Strengths */}
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-green-400 font-semibold text-sm mb-2">
          ✅ Strengths
        </p>
        <ul className="space-y-1">
          {feedback.strengths.map((s, i) => (
            <li key={i} className="text-slate-300 text-sm flex gap-2">
              <span className="text-green-400 mt-0.5">•</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      {/* Weaknesses */}
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-red-400 font-semibold text-sm mb-2">
          ⚠️ Weaknesses
        </p>
        <ul className="space-y-1">
          {feedback.weaknesses.map((w, i) => (
            <li key={i} className="text-slate-300 text-sm flex gap-2">
              <span className="text-red-400 mt-0.5">•</span>
              {w}
            </li>
          ))}
        </ul>
      </div>

      {/* Suggestions */}
      <div className="bg-slate-800 rounded-lg p-4">
        <p className="text-indigo-400 font-semibold text-sm mb-2">
          💡 Suggestions
        </p>
        <ul className="space-y-1">
          {feedback.suggestions.map((s, i) => (
            <li key={i} className="text-slate-300 text-sm flex gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              {s}
            </li>
          ))}
        </ul>
      </div>

      <Button
        onClick={getFeedback}
        disabled={loading}
        variant="outline"
        className="border-slate-700 text-slate-300 w-full text-sm"
      >
        {loading ? "Regenerating..." : "🔄 Regenerate feedback"}
      </Button>
    </div>
  );
}