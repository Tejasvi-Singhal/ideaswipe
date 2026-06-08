import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { headers } from "next/headers";

const createIdeaSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  tagline: z.string().min(10, "Tagline must be at least 10 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  problem: z.string().min(10, "Problem must be at least 10 characters"),
  solution: z.string().min(10, "Solution must be at least 10 characters"),
  targetMarket: z.string().min(5, "Target market must be at least 5 characters"),
  stage: z.enum(["CONCEPT", "BUILDING", "LAUNCHED"]),
  tags: z.array(z.string()).min(1, "Add at least one tag"),
  secretDetails: z.string().optional(),
  isPublished: z.boolean(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validated = createIdeaSchema.parse(body);

    const idea = await db.idea.create({
      data: {
        ...validated,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: (error as z.ZodError).issues[0].message },
        { status: 400 }
      );
    }
    console.error("Create idea error:", error);
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ideas = await db.idea.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Get ideas error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ideas" },
      { status: 500 }
    );
  }
}