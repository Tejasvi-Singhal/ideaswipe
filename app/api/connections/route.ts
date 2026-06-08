import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";

const updateSchema = z.object({
  requestId: z.string(),
  status: z.enum(["APPROVED", "DECLINED"]),
});

// Get all connection requests for ideas you own
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const requests = await db.connectionRequest.findMany({
      where: {
        ownerId: session.user.id,
        status: "PENDING",
      },
      include: {
        idea: {
          select: { id: true, title: true, tagline: true },
        },
        swiper: {
          select: { id: true, name: true, role: true, bio: true, skills: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    console.error("Get connections error:", error);
    return NextResponse.json(
      { error: "Failed to fetch connections" },
      { status: 500 }
    );
  }
}

// Approve or decline a connection request
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { requestId, status } = updateSchema.parse(body);

    const connectionRequest = await db.connectionRequest.findUnique({
      where: { id: requestId },
    });

    if (!connectionRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    if (connectionRequest.ownerId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update the request status
    await db.connectionRequest.update({
      where: { id: requestId },
      data: { status },
    });

    // If approved, create a match
    if (status === "APPROVED") {
      await db.match.create({
        data: {
          ideaId: connectionRequest.ideaId,
          swiperId: connectionRequest.swiperId,
          ownerId: connectionRequest.ownerId,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update connection error:", error);
    return NextResponse.json(
      { error: "Failed to update connection" },
      { status: 500 }
    );
  }
}