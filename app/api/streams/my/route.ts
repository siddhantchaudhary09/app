import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../lib/db.js";

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  const user = await prismaClient.user.findFirst({
    where: {
      email: session?.user?.email ?? "",
    },
  });

  if (!user) {
    return NextResponse.json({ error: "Unauthenticated" }, { status: 404 });
  }

  const streams = await prismaClient.stream.findMany({
    where: {
      userId: user.id,
    },
    include: {
      _count: {
        select: {
          upvotes: true,
        },
      },
      upvotes: {
        where: {
          userId: user.id,
        },
      },
    },
  });

  return NextResponse.json({
    streams: streams.map(({ _count, ...rest }) => ({
      ...rest,
      upvotes: _count.upvotes,
      haveupvoted: rest.upvotes.length > 0 ? true : false,
    })),
  });
}
