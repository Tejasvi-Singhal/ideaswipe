import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import AIFeedback from "@/components/ideas/AIFeedback";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const stageEmoji: Record<string, string> = {
  CONCEPT: "💡",
  BUILDING: "🔨",
  LAUNCHED: "🚀",
};

export default async function IdeaPage({
  params,
}: {
  params: Promise<{ ideaId: string }>;
}) {
  const { ideaId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const idea = await db.idea.findUnique({
    where: { id: ideaId },
    include: {
      author: {
        select: { id: true, name: true, role: true, bio: true },
      },
    },
  });

  if (!idea) notFound();

  const isOwner = session?.user.id === idea.authorId;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <span>{stageEmoji[idea.stage] || "💡"}</span>
          <span className="text-slate-400 text-sm uppercase tracking-wider">
            {idea.stage}
          </span>
        </div>
        <h1 className="text-4xl font-bold text-white mb-3">{idea.title}</h1>
        <p className="text-indigo-400 text-lg">{idea.tagline}</p>

        <div className="flex flex-wrap gap-2 mt-4">
          {idea.tags.map((tag) => (
            <span
              key={tag}
              className="bg-slate-800 text-slate-300 text-sm px-3 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-white font-semibold mb-2">Description</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {idea.description}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-red-400 font-semibold mb-2">🚨 Problem</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {idea.problem}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-green-400 font-semibold mb-2">✅ Solution</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {idea.solution}
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-indigo-400 font-semibold mb-2">
              🎯 Target Market
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {idea.targetMarket}
            </p>
          </div>

          {/* Secret details — only after match */}
          {isOwner && idea.secretDetails && (
            <div className="bg-slate-900 border border-yellow-800 rounded-xl p-5">
              <h2 className="text-yellow-400 font-semibold mb-2">
                🔒 Secret Details (only you can see this)
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                {idea.secretDetails}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Author */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <p className="text-slate-400 text-xs mb-3">Posted by</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
                {isOwner ? idea.author.name[0].toUpperCase() : "?"}
              </div>
              <div>
                <p className="text-white font-semibold">
                  {isOwner ? idea.author.name : "Anonymous"}
                </p>
                <p className="text-slate-400 text-xs">{idea.author.role}</p>
              </div>
            </div>
            {idea.author.bio && isOwner && (
              <p className="text-slate-400 text-sm mt-3">{idea.author.bio}</p>
            )}
          </div>

          {/* AI Feedback — only for owner */}
          {isOwner && <AIFeedback ideaId={idea.id} />}
        </div>
      </div>
    </div>
  );
}