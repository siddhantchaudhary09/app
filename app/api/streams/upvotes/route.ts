import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server.js";
import { z } from "zod";
import { prismaClient } from "../../../lib/db";

const upvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession();

  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });
  if (!user) {
    return NextResponse.json({
      status: 401,
      json: {
        message: "You are not authorized to upvote",
      },
    });
  }
  try {
    const data = upvoteSchema.parse(await req.json());
    await prismaClient.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    return NextResponse.json({
      message: "Upvoted",
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Error While upvoting",
      },
      {
        status: 411,
      }
    );
  }
}
