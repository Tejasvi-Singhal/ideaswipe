import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const swipeSchema = z.object({
  ideaId: z.string(),
  direction: z.enum(["LIKE", "PASS"]),
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
    const { ideaId, direction } = swipeSchema.parse(body);

    // Record the swipe
    const swipe = await db.swipe.create({
      data: {
        swiperId: session.user.id,
        ideaId,
        direction,
      },
    });

    // If liked, create a connection request
    if (direction === "LIKE") {
      const idea = await db.idea.findUnique({
        where: { id: ideaId },
      });

      if (idea && idea.authorId !== session.user.id) {
        await db.connectionRequest.create({
          data: {
            ideaId,
            swiperId: session.user.id,
            ownerId: idea.authorId,
          },
        });
      }
    }

    return NextResponse.json(swipe, { status: 201 });
  } catch (error) {
    console.error("Swipe error:", error);
    return NextResponse.json(
      { error: "Failed to record swipe" },
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

    // Get ideas the user hasn't swiped on yet, excluding their own
    const swipedIdeaIds = await db.swipe.findMany({
      where: { swiperId: session.user.id },
      select: { ideaId: true },
    });

    const swipedIds = swipedIdeaIds.map((s) => s.ideaId);

    const ideas = await db.idea.findMany({
      where: {
        isPublished: true,
        authorId: { not: session.user.id },
        id: { notIn: swipedIds.length > 0 ? swipedIds : [""] },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
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