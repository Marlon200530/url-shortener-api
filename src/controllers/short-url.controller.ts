import { Request, Response } from "express";
import { createShortUrlSchema } from "../schemas/user.schemas";
import { AppError } from "../lib/errors/AppError";
import { createShortUrlService, getUrlService } from "../services/short-url.service";
import type { CustomRequest } from "../middlewares/authMiddleware";


export async function createShortUrl(req: CustomRequest, res: Response) {
  const parsed = createShortUrlSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError("Dados invalidos", 400);
  }

  const userId = req.user?.userId;

  if (userId === undefined || userId === null) {
    throw new AppError("Nao autenticado", 401);
  }

  const shortUrl = await createShortUrlService(parsed.data, userId);
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  return res.status(201).json({
    success: true,
    data: {
      ...shortUrl,
      shortLink: `${baseUrl}/${shortUrl.shortCode}`,
    },
  });
}


export async function getUrl(req: Request, res: Response) {
  const shortCodeParam = req.params.shortCode;
  const shortCode = Array.isArray(shortCodeParam) ? shortCodeParam[0] : shortCodeParam;

  if (!shortCode) {
    throw new AppError("Short code invalido", 400);
  }

  const url = await getUrlService(shortCode);
  return res.redirect(302, url.originalUrl);
}
