import { Request, Response } from "express";
import { createUserSchema, loginUserSchema} from '../schemas/user.schemas';
import { AppError } from "../errors/AppError";
import { createUserService, loginService } from "../services/user.service";
import { generateAcessToken } from "../utils/generateAcessToken";



export async function createUser(req : Request, res: Response) {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
        throw new AppError("Dados invalidos", 400);
    }

    const user = await createUserService(parsed.data);

    res.status(201).json({
        success: "ok",
        data: {
            user
        }
    })
}

export async function login(req: Request, res: Response) {
    const parsed = loginUserSchema.safeParse(req.body);

    if (!parsed.success) throw new AppError("Dados invalidos", 400);

    const user = await loginService(parsed.data);

    const token = generateAcessToken(user);

    res.status(200).json({
        success: "ok",
        data: {
            user,
            access: token
        }
    })

}
