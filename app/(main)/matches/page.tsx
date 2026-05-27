"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

type Match = {
  id: string;
  createdAt: string;
  idea: { id: string; title: string; tagline: string; stage: string };
  swiper: { id: string; name: string; role: string; bio: string | null };
  owner: { id: string; name: string; role: string; bio: string | null };
};

const stageEmoji: Record<string, string> = {
  CONCEPT: "💡",
  BUILDING: "🔨",
  LAUNCHED: "🚀",
};

const roleColors: Record<string, string> = {
  FOUNDER: "bg-indigo-900 text-indigo-300",
  DEVELOPER: "bg-blue-900 text-blue-300",
  DESIGNER: "bg-pink-900 text-pink-300",
  MARKETER: "bg-green-900 text-green-300",
  OTHER: "bg-slate-700 text-slate-300",
};

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const session = await authClient.getSession();
      if (session?.data?.user) {
        setCurrentUserId(session.data.user.id);
      }
      const response = await fetch("/api/matches");
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
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

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">Your Matches</h1>
        <p className="text-slate-400 mb-8">
          People you've connected with. Start a conversation!
        </p>

        {matches.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🤝</p>
            <p className="text-white text-lg font-semibold">No matches yet</p>
            <p className="text-slate-400 mt-2 mb-6">
              Swipe on ideas to start connecting with founders.
            </p>
            <Link href="/swipe">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
                Start Swiping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => {
              const otherPerson =
                currentUserId === match.owner.id ? match.swiper : match.owner;

              return (
                <div
                  key={match.id}
                  className="bg-slate-900 border border-slate-700 rounded-xl p-5"
                >
                  <div className="mb-3 pb-3 border-b border-slate-800">
                    <p className="text-slate-500 text-xs mb-1">
                      {stageEmoji[match.idea.stage]} Matched on
                    </p>
                    <p className="text-indigo-400 font-semibold">
                      {match.idea.title}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                        {otherPerson.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {otherPerson.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            roleColors[otherPerson.role] || roleColors.OTHER
                          }`}
                        >
                          {otherPerson.role}
                        </span>
                      </div>
                    </div>

                    <Link href={`/matches/${match.id}`}>
                      <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm">
                        💬 Chat
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}