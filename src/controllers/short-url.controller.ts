import { Response } from "express";
import { createShortUrlSchema } from "../schemas/user.schemas";
import { AppError } from "../errors/AppError";
import { createShortUrlService } from "../services/short-url.service";
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
