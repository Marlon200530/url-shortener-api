import { Request, Response } from "express";
import { createUserSchema} from '../schemas/user.schemas';
import { AppError } from "../errors/AppError";
import { createUserService } from "../services/user.service";


export async function createUser(req : Request, res: Response) {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
        const validationMessages = parsed.error.issues.map((issue) => issue.message).join("; ");
        throw new AppError(validationMessages || "Dados invalidos", 400);
    }

    const user = await createUserService(parsed.data);

    res.status(201).json({
        success: "ok",
        data: {
            user
        }
    })
}
