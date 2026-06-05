import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { validateIdea } from "@/lib/groq";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ideaId: string }> }
) {
  try {
    const { ideaId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const idea = await db.idea.findUnique({
      where: { id: ideaId },
    });

    if (!idea) {
      return NextResponse.json({ error: "Idea not found" }, { status: 404 });
    }

    // Check if feedback already exists
    const existing = await db.aIFeedback.findFirst({
      where: { ideaId, requestedById: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Generate AI feedback
    const feedback = await validateIdea({
      title: idea.title,
      description: idea.description,
      problem: idea.problem,
      solution: idea.solution,
      targetMarket: idea.targetMarket,
      stage: idea.stage,
    });

    // Save to database
    const saved = await db.aIFeedback.create({
      data: {
        ideaId,
        requestedById: session.user.id,
        validationScore: feedback.validationScore,
        strengths: feedback.strengths,
        weaknesses: feedback.weaknesses,
        suggestions: feedback.suggestions,
      },
    });

    return NextResponse.json(saved);
  } catch (error) {
    console.error("AI validation error:", error);
    return NextResponse.json(
      { error: "Failed to generate AI feedback" },
      { status: 500 }
    );
  }
}