import { NextFunction, Request, Response } from "express";
import {
    getMessageFromCanister,
    savePrincipalWithUserService,
} from "../../services/auth";
import { fromNullable } from "../../utils/utils";
import { User } from "../../database/schemas/User";

// controllers interact with the DB & discord API
// controller methods get the request from the routes and convert them to HTTP responses with the use of any middleware as necessary

export async function verifyMessageController(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const user = req.user as User;
        const { principal } = req.body;
        const response = await getMessageFromCanister(principal);
        const message = fromNullable(response);
        if (message !== undefined) {
            // this way we make sure that the person that
            // sent the message is the same person that
            // tries to request a role
            if (message.discordId === user.discordId) {
                const test = await savePrincipalWithUserService(
                    user.discordId,
                    principal
                );
            }
        }
        res.send(message);
    } catch (error) {
        console.log(error);
        res.send(error).status(400);
    }
}
