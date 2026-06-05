"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/layout/navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen bg-slate-950">
      <Navbar userName={userName} />
      <main>{children}</main>
    </div>
  );
}