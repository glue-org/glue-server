import { NextFunction, Request, Response } from "express";

export const isAuthenticated = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    req.user ? next() : res.sendStatus(403); // we have to call next to continue processing the next middleware function
    console.log(req.user);
};
