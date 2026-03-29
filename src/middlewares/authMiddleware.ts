import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

interface AuthPayload extends JwtPayload {
  userId: number;
}

export interface CustomRequest extends Request {
  user?: AuthPayload;
}

export function auth(req: Request, _res: Response, next: NextFunction) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    return next(new AppError("Falha de configuracao de autenticacao", 500));
  }

  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("Token nao fornecido", 401));
  }

  const token = authHeader.slice("Bearer ".length).trim();

  if (!token) {
    return next(new AppError("Token nao fornecido", 401));
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);

    if (typeof decoded !== "object" || decoded === null || !("userId" in decoded)) {
      return next(new AppError("Token invalido", 401));
    }

    const rawUserId = (decoded as { userId: unknown }).userId;
    const userId = typeof rawUserId === "number" ? rawUserId : Number(rawUserId);

    if (!Number.isInteger(userId) || userId <= 0) {
      return next(new AppError("Token invalido", 401));
    }

    (req as CustomRequest).user = {
      ...(decoded as JwtPayload),
      userId,
    };

    return next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError ||
      error instanceof jwt.NotBeforeError
    ) {
      return next(new AppError("Nao autenticado", 401));
    }

    return next(error);
  }
}
