import bcrypt from "bcrypt";
import type { createUserInput } from "../schemas/user.schemas";
import { createUser } from "../repositories/user.repository";
import { Prisma } from "../../generated/prisma/client";
import { AppError } from "../errors/AppError";

const SALT_ROUNDS = 10;

export async function createUserService(data: createUserInput) {
  try {
    const passwordHash: string = await bcrypt.hash(data.password, SALT_ROUNDS);

    return createUser({
      username: data.username,
      email: data.email,
      passwordHash,
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new AppError("Email ou username já registado", 409);
    }

    throw error;
  }
}
