"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

type Props = {
  userName?: string;
};

export default function Navbar({ userName }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
  }

  const navItems = [
    { href: "/swipe", label: "👆 Swipe" },
    { href: "/ideas", label: "💡 My Ideas" },
    { href: "/connections", label: "🔔 Requests" },
    { href: "/matches", label: "🤝 Matches" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
      <Link href="/dashboard">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💡</span>
          <span className="text-xl font-bold text-white">IdeaSwipe</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={`text-sm ${
                pathname === item.href
                  ? "text-white bg-slate-800"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {item.label}
            </Button>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Link href="/ideas/new">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm">
            + Post Idea
          </Button>
        </Link>
        {userName && (
          <span className="text-slate-400 text-sm hidden md:block">
            {userName}
          </span>
        )}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="border-slate-700 text-slate-300 hover:text-white text-sm"
        >
          Sign out
        </Button>
      </div>
    </nav>
  );
}