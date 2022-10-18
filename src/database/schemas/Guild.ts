import { Schema, model, Types } from "mongoose";

interface Guild {
    guildId: string;
    canisters: [
        {
            canisterId: string;
            tokenStandard:
                | "ext"
                | "dip721"
                | "ogy"
                | "icp-ledger"
                | "ccc"
                | "icrc-1"
                | "dip20";
            role: string;
            users: [Types.ObjectId];
            min?: number;
            max?: number;
        }
    ];
}

const GuildSchema = new Schema<Guild>({
    guildId: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    canisters: [
        {
            canisterId: {
                type: Schema.Types.String,
                required: true,
            },
            tokenStandard: {
                type: Schema.Types.String,
                required: true,
            },
            name: {
                type: Schema.Types.String,
                required: true,
            },
            role: {
                type: Schema.Types.String,
                required: true,
            },
            users: [Schema.Types.ObjectId],
            min: {
                type: Schema.Types.Number,
            },
            max: {
                type: Schema.Types.Number,
            },
        },
    ],
});

export default model<Guild>("guilds", GuildSchema);
