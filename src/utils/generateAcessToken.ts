import jwt from "jsonwebtoken";
import { PublicUser } from "../types/types";

function generateAcessToken(data: PublicUser) {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET nao definido");
  }

  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1d") as jwt.SignOptions["expiresIn"];

  const token = jwt.sign(
    {
      email: data.email,
      username: data.username,
      userId: data.id,
    },
    jwtSecret,
    { expiresIn },
  );

  return token;
}

export { generateAcessToken };
