"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

type Message = {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  sender: { id: string; name: string };
  createdAt: string;
};

type Session = {
  user: { id: string; name: string };
};

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function init() {
      const s = await authClient.getSession();
      if (s?.data?.user) {
        setSession(s.data as Session);
      }

      // Load existing messages
      const response = await fetch(`/api/messages/${matchId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
      setLoading(false);

      // Connect socket
      const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001");
      socketRef.current = socket;

      socket.emit("join-match", matchId);

      socket.on("new-message", (message: Message) => {
        setMessages((prev) => {
          const exists = prev.find((m) => m.id === message.id);
          if (exists) return prev;
          return [...prev, {
            ...message,
            sender: {
              id: message.senderId,
              name: message.senderName || "Unknown",
            },
          }];
        });
      });

      return () => {
        socket.disconnect();
      };
    }

    init();
  }, [matchId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || sending || !session) return;
    setSending(true);

    const content = input.trim();
    setInput("");

    // Save to database
    const response = await fetch(`/api/messages/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    if (response.ok) {
      // Emit via socket for real-time
      socketRef.current?.emit("send-message", {
        matchId,
        content,
        senderId: session.user.id,
        senderName: session.user.name,
      });
    }

    setSending(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <p className="text-slate-400">Loading chat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
        <Link href="/matches" className="flex items-center gap-2 text-slate-400 hover:text-white transition">
          <span>←</span>
          <span className="font-medium">Back to Matches</span>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-xl">💡</span>
          <span className="text-lg font-bold text-white">IdeaSwipe</span>
        </div>
      </nav>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3 max-w-2xl mx-auto w-full">
        {messages.length === 0 && (
          <div className="text-center py-10">
            <p className="text-4xl mb-3">👋</p>
            <p className="text-white font-semibold">You matched!</p>
            <p className="text-slate-400 text-sm mt-1">
              Say hello and start building together.
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isMe = message.sender.id === session?.user.id;
          return (
            <div
              key={message.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                  isMe
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-slate-800 text-slate-200 rounded-bl-sm"
                }`}
              >
                {!isMe && (
                  <p className="text-indigo-400 text-xs font-semibold mb-1">
                    {message.sender.name}
                  </p>
                )}
                <p>{message.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-slate-800 px-4 py-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            disabled={sending}
          />
          <Button
            onClick={sendMessage}
            disabled={sending || !input.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}