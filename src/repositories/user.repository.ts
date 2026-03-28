import { prisma } from "../lib/prisma";

type CreateUserRepoInput = {
  username: string;
  email: string;
  passwordHash: string;
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
