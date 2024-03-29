import { Guild, User } from "../../database/schemas";
import { User as UserType } from "../../database/schemas/User";
import { backend } from "../../utils/declarations/backend";
import { createActor as createDip721 } from "../../utils/declarations/dip721";
import { createActor as createExt } from "../../utils/declarations/ext";
import { createActor as createOgy } from "../../utils/declarations/ogy";
import { createActor as createIcpLedger } from "../../utils/declarations/icp-ledger";
import { createActor as createCcc } from "../../utils/declarations/ccc";
import { createActor as createIcrc1 } from "../../utils/declarations/icrc-1";
import { createActor as createDip20 } from "../../utils/declarations/dip20";
import { AccountIdentifier } from "@dfinity/nns";
import { Principal } from "@dfinity/principal";
import { fromOk, isErr, principalToAccountId } from "../../utils/utils";
import axios from "axios";
import { DISCORD_API_URL } from "../../utils/constants";
import { Role } from "../../utils/types";

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
    let result = await Guild.findOne({ guildId: guildId }, { canisters: 1 });
    result!["canisters"].forEach(async (canister) => {
        if (
            await userHasToken(
                canister.tokenStandard,
                principal,
                canister.canisterId,
                canister.min, // if the property doesnt exist (like in legacy entries), this will just return `undefined`
                canister.max
            )
        ) {
            await saveUserWithCanisterService(
                guildId,
                canister.canisterId,
                user.id
            ); // we pass the mongod id
            await setUserRole(canister.role, guildId, user.discordId);
        }
    });
}

export async function userHasToken(
    tokenStandard: string,
    principal: string,
    canisterId: string,
    min: number | undefined,
    max: number | undefined
): Promise<boolean> {
    if (tokenStandard === "dip721") {
        const dip721 = createDip721(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        // because this is a rust implenetation it returns `Ok` instead of `ok`
        let result = await dip721.ownerTokenIdentifiers(
            Principal.fromText(principal)
        );
        if (isErr(result)) {
            return false;
        } else if ("Ok" in result) {
            if (min && max) {
                if (min <= result.Ok.length && result.Ok.length <= max)
                    return true;
            } else if (min) {
                if (min <= result.Ok.length) return true;
            } else if (max) {
                if (result.Ok.length <= max) return true;
            } else {
                if (result.Ok.length != 0) return true;
            }
        }
    } else if (tokenStandard === "ext") {
        const ext = createExt(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let account = principalToAccountId(Principal.fromText(principal));
        let result = await ext.tokens(account);
        // can be an empty array as well
        if (isErr(result)) {
            return false;
        } else if ("ok" in result) {
            if (min && max) {
                if (min <= result.ok.length && result.ok.length <= max)
                    return true;
            } else if (min) {
                if (min <= result.ok.length) return true;
            } else if (max) {
                if (result.ok.length <= max) return true;
            } else {
                // just becaue the response is ok doesn't mean the user actually owns nfts
                if (result.ok.length != 0) return true;
            }
        }
    } else if (tokenStandard === "ogy") {
        const ogy = createOgy(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let result = await ogy.balance_of_nft_origyn({
            principal: Principal.fromText(principal),
        });
        if (isErr(result)) {
            return false;
        } else if ("ok" in result) {
            if (min && max) {
                if (
                    min <= result.ok.nfts.length &&
                    result.ok.nfts.length <= max
                )
                    return true;
            } else if (min) {
                if (min <= result.ok.nfts.length) return true;
            } else if (max) {
                if (result.ok.nfts.length <= max) return true;
            } else {
                // just becaue the response is ok doesn't mean the user actually owns nfts
                if (result.ok.nfts.length != 0) return true;
            }
        }
    } else if (tokenStandard === "icp-ledger") {
        const icpLedger = createIcpLedger(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let result = await icpLedger.account_balance({
            account: AccountIdentifier.fromPrincipal({
                principal: Principal.fromText(principal),
            }).toNumbers(),
        });
        if (result.e8s === 0n) {
            return false;
        }
        if (min && max) {
            if (min <= result.e8s && result.e8s <= max) return true;
        } else if (min) {
            if (min <= result.e8s) return true;
        } else if (max) {
            if (result.e8s <= max) return true;
        } else {
            // we already know the response is not 0 so we can immediately return true
            return true;
        }
    } else if (tokenStandard === "ccc") {
        const ccc = createCcc(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let result = await ccc.balanceOf(Principal.fromText(principal));
        if (result === 0n) {
            return false;
        }
        if (min && max) {
            if (min <= result && result <= max) return true;
        } else if (min) {
            if (min <= result) return true;
        } else if (max) {
            if (result <= max) return true;
        } else {
            return true;
        }
    } else if (tokenStandard === "icrc-1") {
        const icrc1 = createIcrc1(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let result = await icrc1.icrc1_balance_of({
            owner: Principal.fromText(principal),
            subaccount: [],
        });
        if (result === 0n) {
            return false;
        }
        if (min && max) {
            if (min <= result && result <= max) return true;
        } else if (min) {
            if (min <= result) return true;
        } else if (max) {
            if (result <= max) return true;
        } else {
            return true;
        }
    } else if (tokenStandard === "dip20") {
        const dip20 = createDip20(canisterId, {
            agentOptions: { host: "https://ic0.app" },
        });
        let result = await dip20.balanceOf(Principal.fromText(principal));
        if (result === 0n) {
            return false;
        }
        if (min && max) {
            if (min <= result && result <= max) return true;
        } else if (min) {
            if (min <= result) return true;
        } else if (max) {
            if (result <= max) return true;
        } else {
            return true;
        }
    }
    return false;
}

export async function setUserRole(
    role: string,
    guildId: string,
    discordId: string
) {
    const TOKEN = process.env.DISCORD_TOKEN;
    try {
        // get server roles
        const roleResponse = await axios.get<Role[]>(
            `${DISCORD_API_URL}/guilds/${guildId}/roles`,
            {
                headers: {
                    Authorization: `Bot ${TOKEN}`,
                },
            }
        );
        // extract snowflake for role
        const snowflake = roleResponse.data.filter(
            (element) => element.name === role
        )[0]?.id;

        // add role
        const guildResponse = await axios.put(
            `${DISCORD_API_URL}/guilds/${guildId}/members/${discordId}/roles/${snowflake}`,
            {}, //empty data object for put request
            {
                headers: {
                    Authorization: `Bot ${TOKEN}`,
                },
            }
        );
    } catch (error) {
        console.error(error);
    }
}
