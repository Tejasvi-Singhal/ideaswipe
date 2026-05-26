"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SwipeCard from "@/components/swipe/SwipeCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Idea = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  targetMarket: string;
  stage: string;
  tags: string[];
  author: {
    name: string;
    role: string;
    avatarUrl: string | null;
  };
};

export default function SwipePage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    fetchIdeas();
  }, []);

  async function fetchIdeas() {
    const response = await fetch("/api/swipe");
    if (response.ok) {
      const data = await response.json();
      setIdeas(data);
    }
    setLoading(false);
  }

  async function handleSwipe(ideaId: string, direction: "LIKE" | "PASS") {
    if (swiping) return;
    setSwiping(true);

    await fetch("/api/swipe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ideaId, direction }),
    });

    // Remove the swiped card
    setIdeas((prev) => prev.filter((i) => i.id !== ideaId));
    setSwiping(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading ideas...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <Link href="/dashboard">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💡</span>
            <span className="text-xl font-bold text-white">IdeaSwipe</span>
          </div>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline" className="border-slate-700 text-slate-300">
            Dashboard
          </Button>
        </Link>
      </nav>

      {/* Swipe Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {ideas.length === 0 ? (
          <div className="text-center">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-white text-xl font-bold mb-2">
              You've seen all ideas!
            </h2>
            <p className="text-slate-400 mb-6">
              Check back later or post your own idea.
            </p>
            <Link href="/ideas/new">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Post an Idea
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <p className="text-slate-400 text-sm mb-6">
              {ideas.length} idea{ideas.length !== 1 ? "s" : ""} to explore
            </p>

            {/* Card Stack */}
            <div className="relative w-full max-w-sm h-[520px]">
              {ideas
                .slice(0, 3)
                .reverse()
                .map((idea, index) => (
                  <div
                    key={idea.id}
                    style={{
                      transform: `scale(${1 - index * 0.04}) translateY(${index * 12}px)`,
                      zIndex: 3 - index,
                    }}
                    className="absolute w-full"
                  >
                    <SwipeCard
                      idea={idea}
                      onSwipe={handleSwipe}
                      isTop={index === 0}
                    />
                  </div>
                ))}
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-6 mt-8">
              <button
                onClick={() => handleSwipe(ideas[0].id, "PASS")}
                disabled={swiping}
                className="w-16 h-16 rounded-full bg-slate-800 border-2 border-red-500 text-2xl flex items-center justify-center hover:bg-red-950 transition disabled:opacity-50"
              >
                👎
              </button>
              <button
                onClick={() => handleSwipe(ideas[0].id, "LIKE")}
                disabled={swiping}
                className="w-16 h-16 rounded-full bg-slate-800 border-2 border-green-500 text-2xl flex items-center justify-center hover:bg-green-950 transition disabled:opacity-50"
              >
                👍
              </button>
            </div>
            <p className="text-slate-600 text-xs mt-4">
              Drag the card or use the buttons
            </p>
          </>
        )}
      </div>
    </div>
  );
}