"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState } from "react";

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
  };
};

type Props = {
  idea: Idea;
  onSwipe: (ideaId: string, direction: "LIKE" | "PASS") => void;
  isTop: boolean;
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

export default function SwipeCard({ idea, onSwipe, isTop }: Props) {
  const [leaving, setLeaving] = useState(false);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-20, 20]);
  const likeOpacity = useTransform(x, [20, 100], [0, 1]);
  const passOpacity = useTransform(x, [-100, -20], [1, 0]);

  function handleDragEnd(_: unknown, info: { offset: { x: number } }) {
    if (leaving) return;
    if (info.offset.x > 100) {
      setLeaving(true);
      onSwipe(idea.id, "LIKE");
    } else if (info.offset.x < -100) {
      setLeaving(true);
      onSwipe(idea.id, "PASS");
    }
  }

  return (
    <motion.div
      style={{ x, rotate }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      className="absolute w-full cursor-grab active:cursor-grabbing"
      whileDrag={{ scale: 1.02 }}
    >
      {/* Like / Pass overlays */}
      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 left-6 z-10 border-4 border-green-400 text-green-400 font-bold text-2xl px-4 py-1 rounded-lg rotate-[-12deg]"
      >
        LIKE 👍
      </motion.div>
      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-6 right-6 z-10 border-4 border-red-400 text-red-400 font-bold text-2xl px-4 py-1 rounded-lg rotate-[12deg]"
      >
        PASS 👎
      </motion.div>

      {/* Card */}
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 select-none">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">{stageEmoji[idea.stage] || "💡"}</span>
              <span className="text-slate-400 text-xs uppercase tracking-wider">
                {idea.stage}
              </span>
            </div>
            <h2 className="text-white text-xl font-bold leading-tight">
              {idea.title}
            </h2>
            <p className="text-indigo-400 text-sm mt-1">{idea.tagline}</p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Problem / Solution */}
        <div className="space-y-3 mb-4">
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-1">
              Problem
            </p>
            <p className="text-slate-300 text-sm">{idea.problem}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-1">
              Solution
            </p>
            <p className="text-slate-300 text-sm">{idea.solution}</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-3">
            <p className="text-slate-400 text-xs font-semibold uppercase mb-1">
              Target Market
            </p>
            <p className="text-slate-300 text-sm">{idea.targetMarket}</p>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-800">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            ?
          </div>
          <div>
            <p className="text-slate-500 text-xs">Posted anonymously</p>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                roleColors[idea.author.role] || roleColors.OTHER
              }`}
            >
              {idea.author.role}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}