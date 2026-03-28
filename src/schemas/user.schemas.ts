import { z } from "zod";

export const createUserSchema = z.object({
    username: z.string().min(3, "username dever ter no minimo 3 caracteres").max(50, "username deve ter no maximo 50 caracteres"),
    email: z.email("email invalido"),
    password: z.string().min(6, "password deve ter no minimo 6 caracters").max(50, "password deve ter no maximo 50 caracters")
})

export const loginUserSchema = z.object({
    email: z.email("email invalido"),
    password: z.string().min(6, "password deve ter no minimo 6 caracteres").max(50, "password deve ter no maximo 50 caracters")
})


export type createUserInput = z.infer<typeof createUserSchema>;
export type loginUserInput =  z.infer<typeof loginUserSchema>
