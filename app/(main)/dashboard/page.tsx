"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();

  async function handleLogout() {
    await authClient.signOut();
    router.push("/");
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
      <h1 className="text-white text-2xl">Dashboard — coming soon</h1>
      <Button
        onClick={handleLogout}
        variant="outline"
        className="border-slate-700 text-slate-300"
      >
        Sign out
      </Button>
    </div>
  );
}