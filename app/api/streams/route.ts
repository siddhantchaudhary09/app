import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prismaClient } from "../../lib/db";
//@ts-ignore
import { getServerSession } from "next-auth";
import youtubesearchapi from "youtube-search-api";

const YT_REGEX = new RegExp(
  /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)([^&=#\?]{11}).*$/
);
const createStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = createStreamSchema.parse(await req.json());
    const isYT = YT_REGEX.test(data.url);
    if (!isYT) {
      return NextResponse.json(
        {
          message: "Incorrect URL",
        },
        {
          status: 411,
        }
      );
    }

    const extractedId = data.url.split("?v=")[1];
    const vid = await youtubesearchapi.GetVideoDetails(extractedId);
    const thumbnails = vid.thumbnail.thumbnails;
    thumbnails.sort((a: { width: Number }, b: { width: Number }) =>
      a.width < a.width ? -1 : 1
    );
    await prismaClient.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: vid.title ?? "API BAND HO GYI",
        bigimage: thumbnails[thumbnails.length - 1].url ?? "",
        smallimage:
          thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url ?? "",
      },
    });

    return NextResponse.json({
      message: "Stream Added",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        message: "Error While adding a Stream",
      },
      {
        status: 411,
      }
    );
  }
}

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  console.log(creatorId);

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
      userId: creatorId ?? "",
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
