import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

interface AuthPayload extends JwtPayload {
  id: string;
}

export interface CustomRequest extends Request {
  user?: AuthPayload;
}

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      throw new AppError("Token não fornecido", 401);
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    (req as CustomRequest).user = decoded;

    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      data: {
        message: "Não autenticado",
      },
    });
  }
}