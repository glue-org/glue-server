import { Guild, User } from "../../database/schemas";
import { backend } from "../../utils/declarations/backend";
import { createActor as createDip721 } from "../../utils/declarations/dip721";
import { createActor as createExt } from "../../utils/declarations/ext";
import { Principal } from "@dfinity/principal";
import { isErr, principalToAccountId } from "../../utils/utils";

export async function savePrincipalWithUserService(
    discordId: string,
    principal: string
): Promise<string> {
    const user = await User.findOne(
        { principals: principal },
        { discordId: 1 }
    );
    if (user && user?.discordId !== discordId) {
        throw "Principal already connected to a different account";
    }
    let updatedUser = await User.findOneAndUpdate(
        { discordId: discordId },
        { $addToSet: { principals: principal } },
        { new: true }
    );
    return updatedUser?.id;
}

export async function saveUserWithGuildService(
    guildId: string,
    userId: string
) {
    const guildExist = await Guild.exists({ guildId: guildId });
    if (!guildExist)
        throw "Guild has no profile yet, please contact the server admin";

    const updatedGuild = await Guild.findOneAndUpdate(
        { guildId: guildId },
        { $addToSet: { "canisters.$[].users": userId } }, // this way we update all elements of the canister array
        { new: true }
    );
}

export async function getMessageFromCanister(principal: string) {
    const response = await backend.retrieveMessage(
        Principal.fromText(principal)
    );
    return response;
}

export async function userHastoken(
    tokenStandard: string,
    principal: string,
    canisterId: string
) {
    if (tokenStandard === "dip721") {
        const dip721 = createDip721(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let result = dip721.ownerTokenIdentifiers(
            Principal.fromText(principal)
        );
        if (isErr(result)) {
            throw "User has no token";
        }
    } else {
        const ext = createExt(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let account = principalToAccountId(Principal.fromText(principal));
        let result = ext.tokens(account);
        if (isErr(result)) {
            throw "User has no token";
        }
    }
}
