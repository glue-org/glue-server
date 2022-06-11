import { Schema, model, Types } from "mongoose";

interface Guild {
    guildId: string;
    canisters: [
        {
            canisterId: string;
            tokenStandard: "ext" | "dip721";
            role: string;
            users: [Types.ObjectId];
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
            role: {
                type: Schema.Types.String,
                required: true,
            },
            users: [{ type: Schema.Types.ObjectId, required: true }],
        },
    ],
});

export default model<Guild>("guilds", GuildSchema);
