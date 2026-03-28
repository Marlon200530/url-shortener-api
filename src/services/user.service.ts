import bcrypt from "bcrypt";
import type { createUserInput, loginUserInput } from "../schemas/user.schemas";
import type { PublicUser } from "../types/types";
import { createUser, login } from "../repositories/user.repository";
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

export async function loginService({email, password} : loginUserInput) : Promise<PublicUser> {
  const user = await login({ email });

  if (!user) {
    throw new AppError("Credenciais invalidas", 401);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError("Credenciais invalidas", 401);
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
  };
}
