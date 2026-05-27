import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const matches = await db.match.findMany({
      where: {
        OR: [
          { swiperId: session.user.id },
          { ownerId: session.user.id },
        ],
      },
      include: {
        idea: {
          select: { id: true, title: true, tagline: true, stage: true },
        },
        swiper: {
          select: { id: true, name: true, role: true, bio: true },
        },
        owner: {
          select: { id: true, name: true, role: true, bio: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(matches);
  } catch (error) {
    console.error("Get matches error:", error);
    return NextResponse.json(
      { error: "Failed to fetch matches" },
      { status: 500 }
    );
  }
}