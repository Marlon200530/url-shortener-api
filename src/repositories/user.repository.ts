import { prisma } from "../lib/prisma";
import type { User } from "../types/types";

type CreateUserRepoInput = {
  username: string;
  email: string;
  passwordHash: string;
};

type LoginUserRepoInput = {
    email: string;
};

export async function createUser(data : CreateUserRepoInput) {

    const user = await prisma.user.create({
        data: {
            username: data.username,
            email: data.email,
            password: data.passwordHash
        },
        select: {id: true, username: true, email: true}
    })

    return user;
}


export async function login({ email }: LoginUserRepoInput): Promise<User | null> {
    return prisma.user.findUnique({
        where: { email },
        select: {
            id: true,
            username: true,
            email: true,
            password: true
        }
    });
}
