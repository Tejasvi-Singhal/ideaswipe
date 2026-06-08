"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export default function DashboardPage() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function getUser() {
      const session = await authClient.getSession();
      if (session?.data?.user?.name) {
        setUserName(session.data.user.name);
      }
    }
    getUser();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white">
          Welcome back{userName ? `, ${userName}` : ""}! 👋
        </h1>
        <p className="text-slate-400 mt-2">What do you want to do today?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/ideas/new">
          <div className="border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer bg-slate-900 group">
            <div className="text-3xl mb-3">💡</div>
            <h2 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">
              Post an Idea
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Share your startup idea and find collaborators
            </p>
          </div>
        </Link>
        <Link href="/swipe">
          <div className="border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer bg-slate-900 group">
            <div className="text-3xl mb-3">👆</div>
            <h2 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">
              Swipe Ideas
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Browse and swipe on startup ideas
            </p>
          </div>
        </Link>
        <Link href="/connections">
          <div className="border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer bg-slate-900 group">
            <div className="text-3xl mb-3">🔔</div>
            <h2 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">
              Connection Requests
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              See who liked your ideas and approve connections
            </p>
          </div>
        </Link>
        <Link href="/matches">
          <div className="border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer bg-slate-900 group">
            <div className="text-3xl mb-3">🤝</div>
            <h2 className="text-white font-semibold text-lg group-hover:text-indigo-400 transition">
              Your Matches
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Chat with people you've connected with
            </p>
          </div>
        </Link>
      </div>
    </div>
  );
}