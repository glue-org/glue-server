import { NextFunction, Request, Response } from "express";
import {
    getMessageFromCanister,
    savePrincipalWithUserService,
    saveUserWithGuildService,
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
        const user = req.user as User; // the user is the user associated with the current session
        const { principal } = req.body; // the principal is coming from the POST request that the client sends
        const response = await getMessageFromCanister(principal); // we fetch a signed message from the canister using the principal as a key
        const message = fromNullable(response); // we check if there was a value present for the provided principal
        if (message !== undefined) {
            // this way we make sure that the person that
            // sent the message is the same person that
            // tries to request a role
            if (message.discordId === user.discordId) {
                await savePrincipalWithUserService(user.discordId, principal);
                await saveUserWithGuildService(message.guildId, user.id); // note that we pass the mongoDB id of the user!
            }
        }
        res.send(message);
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}
