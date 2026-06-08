"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Idea = {
  id: string;
  title: string;
  tagline: string;
  stage: string;
  isPublished: boolean;
  tags: string[];
  createdAt: string;
};

const stageEmoji: Record<string, string> = {
  CONCEPT: "💡",
  BUILDING: "🔨",
  LAUNCHED: "🚀",
};

export default function MyIdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchIdeas() {
      const response = await fetch("/api/ideas/mine");
      if (response.ok) {
        const data = await response.json();
        setIdeas(data);
      }
      setLoading(false);
    }
    fetchIdeas();
  }, []);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <p className="text-slate-400">Loading your ideas...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Ideas</h1>
          <p className="text-slate-400 mt-1">All your posted startup ideas</p>
        </div>
        <Link href="/ideas/new">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
            + New Idea
          </Button>
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-4xl mb-4">💡</p>
          <p className="text-white text-lg font-semibold">No ideas yet</p>
          <p className="text-slate-400 mt-2 mb-6">
            Post your first startup idea to get started.
          </p>
          <Link href="/ideas/new">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
              Post an Idea
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {ideas.map((idea) => (
            <Link key={idea.id} href={`/ideas/${idea.id}`}>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-indigo-500 transition cursor-pointer">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span>{stageEmoji[idea.stage]}</span>
                      <span className="text-slate-500 text-xs uppercase">
                        {idea.stage}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          idea.isPublished
                            ? "bg-green-900 text-green-400"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {idea.isPublished ? "Published" : "Draft"}
                      </span>
                    </div>
                    <h2 className="text-white font-semibold text-lg">
                      {idea.title}
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">{idea.tagline}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {idea.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-slate-600 text-sm ml-4">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}