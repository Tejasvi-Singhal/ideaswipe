import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <span className="text-xl font-bold text-white">IdeaSwipe</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              Sign in
            </Button>
          </Link>
          <Link href="/signup">
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
              Get started
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4">

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Swipe on ideas.
          <br />
          <span className="text-indigo-400">Build together.</span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mb-10">
          Discover startup ideas, connect with founders, and find your
          co-founder — all through a swipe.
        </p>

        <div className="flex items-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8"
            >
              Start swiping free
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-slate-700 text-slate-300 hover:text-white px-8"
            >
              Sign in
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-12 mt-20 text-center">
          <div>
            <p className="text-3xl font-bold text-white">500+</p>
            <p className="text-slate-400 text-sm mt-1">Ideas posted</p>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <p className="text-3xl font-bold text-white">120+</p>
            <p className="text-slate-400 text-sm mt-1">Matches made</p>
          </div>
          <div className="w-px h-10 bg-slate-800" />
          <div>
            <p className="text-3xl font-bold text-white">40+</p>
            <p className="text-slate-400 text-sm mt-1">Teams formed</p>
          </div>
        </div>
      </div>
    </main>
  );
}