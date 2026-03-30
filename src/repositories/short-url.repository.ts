import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

type CreateShortUrlRepoInput = {
  userId: number;
  customAlias?: string | null;
  originalTextUrl: string;
};

export type CreatedShortUrlRepoResult = {
  id: number;
  originalUrl: string;
  shortCode: string;
  customAlias: string | null;
  createdAt: Date;
};

export type GetShortUrlRepoResult = {
  id: number;
  shortCode: string;
  customAlias: string | null;
  clickCount: number;
  expiresAt: Date | null;
  createdAt: Date;
  originalUrl: string;
};

function generateShortCode(length = 7): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";

  for (let i = 0; i < length; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  return code;
}

export async function createShortUrl(data: CreateShortUrlRepoInput): Promise<CreatedShortUrlRepoResult> {
  const maxAttempts = data.customAlias ? 1 : 3;
  let lastError: unknown = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shortCode = data.customAlias ?? generateShortCode();

    try {
      const created = await prisma.url.create({
        data: {
          originalUrl: data.originalTextUrl,
          shortUrls: {
            create: {
              shortCode,
              customAlias: data.customAlias ?? null,
              userId: data.userId,
            },
          },
        },
        include: {
          shortUrls: true,
        },
      });

      const createdShort = created.shortUrls[0];

      if (!createdShort) {
        throw new Error("FAILED_TO_CREATE_SHORT_URL");
      }

      return {
        id: createdShort.id,
        originalUrl: created.originalUrl,
        shortCode: createdShort.shortCode,
        customAlias: createdShort.customAlias,
        createdAt: createdShort.createdAt,
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        if (!data.customAlias && attempt < maxAttempts - 1) {
          lastError = error;
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError ?? new Error("FAILED_TO_GENERATE_SHORT_CODE");
}

export async function getUrl(shortCode: string): Promise<GetShortUrlRepoResult> {
  const shortUrl = await prisma.shortUrl.update({
    where: { shortCode },
    data: {
      clickCount: {
        increment: 1,
      },
    },
    select: {
      id: true,
      shortCode: true,
      customAlias: true,
      clickCount: true,
      expiresAt: true,
      createdAt: true,
      url: {
        select: {
          originalUrl: true,
        },
      },
    },
  });

  return {
    id: shortUrl.id,
    shortCode: shortUrl.shortCode,
    customAlias: shortUrl.customAlias,
    clickCount: shortUrl.clickCount,
    expiresAt: shortUrl.expiresAt,
    createdAt: shortUrl.createdAt,
    originalUrl: shortUrl.url.originalUrl,
  };
}
