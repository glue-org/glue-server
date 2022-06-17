import { Guild, User } from "../../database/schemas";
import { User as UserType } from "../../database/schemas/User";
import { backend } from "../../utils/declarations/backend";
import { createActor as createDip721 } from "../../utils/declarations/dip721";
import { createActor as createExt } from "../../utils/declarations/ext";
import { Principal } from "@dfinity/principal";
import { fromOk, isErr, principalToAccountId } from "../../utils/utils";

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

export async function saveUserWithCanisterService(
    guildId: string,
    canisterId: string,
    userId: string
) {
    const guildExist = await Guild.exists({ guildId: guildId });
    if (!guildExist)
        throw "Guild has no profile yet, please contact the server admin";

    const updatedGuild = await Guild.findOneAndUpdate(
        { guildId: guildId, "canisters.canisterId": canisterId },
        { $addToSet: { "canisters.$.users": userId } }, // this way we update all elements of the canister array
        { new: true }
    );
}

export async function getMessageFromCanister(principal: string) {
    const response = await backend.retrieveMessage(
        Principal.fromText(principal)
    );
    return response;
}

export async function verifyOwnership(
    guildId: string,
    principal: string,
    user: UserType
) {
    const guildExist = await Guild.exists({ guildId: guildId });
    if (!guildExist)
        throw "Guild has no profile yet, please contact the server admin";
    let canisters = await Guild.findOne({ guildId: guildId }, { canisters: 1 });
    canisters!["canisters"].forEach(async (canister) => {
        if (
            await userHasToken(
                canister.tokenStandard,
                principal,
                canister.canisterId
            )
        ) {
            saveUserWithCanisterService(guildId, canister.canisterId, user.id); // we pass the mongod id
        }
    });
}

export async function userHasToken(
    tokenStandard: string,
    principal: string,
    canisterId: string
): Promise<boolean> {
    if (tokenStandard === "dip721") {
        const dip721 = createDip721(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let result = await dip721.ownerTokenIdentifiers(
            Principal.fromText(principal)
        );
        if (isErr(result)) {
            return false;
        }
        return true;
    } else {
        const ext = createExt(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let account = principalToAccountId(Principal.fromText(principal));
        let result = await ext.tokens(account);
        if (isErr(result) || fromOk(result).length === 0) {
            // can be an empty array as well
            return false;
        }
        return true;
    }
}
