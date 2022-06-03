import { NextFunction, Request, Response } from "express";
import { saveUserToDBService } from "../../services/auth";

export async function verifySignature(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const test = await saveUserToDBService();
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}
