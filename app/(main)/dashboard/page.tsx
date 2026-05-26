"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <span className="text-xl font-bold text-white">IdeaSwipe</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/ideas/new">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
              + Post Idea
            </Button>
          </Link>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-slate-700 text-slate-300"
          >
            Sign out
          </Button>
        </div>
      </nav>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">Welcome back! Start swiping or post your idea.</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/ideas/new">
            <div className="border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer bg-slate-900">
              <div className="text-3xl mb-3">💡</div>
              <h2 className="text-white font-semibold text-lg">Post an Idea</h2>
              <p className="text-slate-400 text-sm mt-1">
                Share your startup idea and find collaborators
              </p>
            </div>
          </Link>
          <Link href="/swipe">
            <div className="border border-slate-800 rounded-xl p-6 hover:border-indigo-500 transition cursor-pointer bg-slate-900">
              <div className="text-3xl mb-3">👆</div>
              <h2 className="text-white font-semibold text-lg">Swipe Ideas</h2>
              <p className="text-slate-400 text-sm mt-1">
                Browse and swipe on startup ideas
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}