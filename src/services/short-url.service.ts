import { createShortUrl, getUrl } from "../repositories/short-url.repository";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../lib/errors/AppError";
import type { createShortUrlInput } from "../schemas/user.schemas";

export async function createShortUrlService(data: createShortUrlInput, userId: number) {
  try {
    return await createShortUrl({
      userId,
      customAlias: data.customAlias,
      originalTextUrl: data.orginalUrlText,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("Alias ja em uso", 409);
    }

    if (
      error instanceof Error &&
      (error.message === "FAILED_TO_GENERATE_SHORT_CODE" ||
        error.message === "FAILED_TO_CREATE_SHORT_URL")
    ) {
      throw new AppError("Nao foi possivel gerar short code", 500);
    }

    throw error;
  }
}


export async function getUrlService(shortCode:string) {
  try {
    return await getUrl(shortCode);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new AppError("URL nao encontrada", 404);
    }

    throw error;
  }
}  
