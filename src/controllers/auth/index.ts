import { NextFunction, Request, Response } from "express";

export async function verifySignature(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.sendStatus(200);
}
