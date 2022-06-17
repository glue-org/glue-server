import { sha224 } from "js-sha256";
import crc32 from "crc-32";
import { Principal } from "@dfinity/principal";

export const fromNullable = <T>(value: [] | [T]): T | undefined => {
    return value?.[0];
};

export function isErr(result: any): boolean {
    if (result) {
        if ("err" in result || "Err" in result) {
            return true;
        }
    }
    return false;
}

export function fromOk(result: any): any {
    // get the value from an ok result
    return result.ok;
}

// from tipjar (https://github.com/ninegua/tipjar/blob/b68730fa85a6b3d46aa2173ddc9a9b268d1be45b/src/tipjar_assets/src/agent.js#L62)
export function principalToAccountId(
    principal: Principal,
    subaccount?: Uint8Array
) {
    const shaObj = sha224.create();
    shaObj.update("\x0Aaccount-id");
    shaObj.update(principal.toUint8Array());
    shaObj.update(subaccount ? subaccount : new Uint8Array(32));
    const hash = new Uint8Array(shaObj.array());
    const crc = crc32.buf(hash);
    return toHexString([
        (crc >> 24) & 0xff,
        (crc >> 16) & 0xff,
        (crc >> 8) & 0xff,
        crc & 0xff,
        ...hash,
    ]);
}

export function toHexString(byteArray: number[]) {
    return Buffer.from(byteArray).toString("hex");
}
