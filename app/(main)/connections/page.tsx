"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type ConnectionRequest = {
  id: string;
  status: string;
  createdAt: string;
  idea: { id: string; title: string; tagline: string };
  swiper: {
    id: string;
    name: string;
    role: string;
    bio: string | null;
    skills: string[];
  };
};

const roleColors: Record<string, string> = {
  FOUNDER: "bg-indigo-900 text-indigo-300",
  DEVELOPER: "bg-blue-900 text-blue-300",
  DESIGNER: "bg-pink-900 text-pink-300",
  MARKETER: "bg-green-900 text-green-300",
  OTHER: "bg-slate-700 text-slate-300",
};

export default function ConnectionsPage() {
  const [requests, setRequests] = useState<ConnectionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    const response = await fetch("/api/connections");
    if (response.ok) {
      const data = await response.json();
      setRequests(data);
    }
    setLoading(false);
  }

  async function handleAction(requestId: string, status: "APPROVED" | "DECLINED") {
    setActing(requestId);

    await fetch("/api/connections", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, status }),
    });

    setRequests((prev) => prev.filter((r) => r.id !== requestId));
    setActing(null);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">

      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-white mb-2">
          Connection Requests
        </h1>
        <p className="text-slate-400 mb-8">
          People who liked your ideas. Approve to connect and start chatting.
        </p>

        {requests.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">👀</p>
            <p className="text-white text-lg font-semibold">No pending requests</p>
            <p className="text-slate-400 mt-2">
              When someone likes your idea, they'll appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="bg-slate-900 border border-slate-700 rounded-xl p-5"
              >
                {/* Idea */}
                <div className="mb-4 pb-4 border-b border-slate-800">
                  <p className="text-slate-500 text-xs mb-1">Liked your idea</p>
                  <p className="text-indigo-400 font-semibold">
                    {request.idea.title}
                  </p>
                </div>

                {/* Swiper info */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                        {request.swiper.name[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="text-white font-semibold">
                          {request.swiper.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            roleColors[request.swiper.role] || roleColors.OTHER
                          }`}
                        >
                          {request.swiper.role}
                        </span>
                      </div>
                    </div>

                    {request.swiper.bio && (
                      <p className="text-slate-400 text-sm mb-2">
                        {request.swiper.bio}
                      </p>
                    )}

                    {request.swiper.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {request.swiper.skills.map((skill) => (
                          <span
                            key={skill}
                            className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleAction(request.id, "APPROVED")}
                      disabled={acting === request.id}
                      className="bg-green-700 hover:bg-green-600 text-white text-sm"
                    >
                      ✓ Approve
                    </Button>
                    <Button
                      onClick={() => handleAction(request.id, "DECLINED")}
                      disabled={acting === request.id}
                      variant="outline"
                      className="border-red-800 text-red-400 hover:bg-red-950 text-sm"
                    >
                      ✕ Decline
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}