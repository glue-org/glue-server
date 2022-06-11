import axios from "axios";
import { User } from "../../database/schemas";
import { DISCORD_API_URL } from "../../utils/constants";
import { backend } from "../../utils/declarations/backend";
import { Principal } from "@dfinity/principal";

export async function savePrincipalWithUserService(
    id: string,
    principal: string
) {
    console.log("checking if principal already used");
    const principalUsed = await User.exists({ principals: principal });
    if (principalUsed) throw "Principal already used with another discordId";
    await User.findOneAndUpdate(
        { discordId: id },
        { $push: { principals: principal } }
    );
}

export async function getMessageFromCanister(principal: string) {
    const response = await backend.retrieveMessage(
        Principal.fromText(principal)
    );
    return response;
}
