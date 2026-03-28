import type { ErrorRequestHandler, RequestHandler } from "express";
import { AppError } from "../errors/AppError";

const isProduction = process.env.NODE_ENV === "production";

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(`Rota não encontrada: ${req.method} ${req.originalUrl}`, 404));
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof AppError ? err.message : "Erro interno do servidor";

  const payload: { error: string; stack?: string } = { error: message };

  if (!isProduction && err instanceof Error) {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
};
