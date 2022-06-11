import { Schema, model } from "mongoose";

export interface User {
    discordId: string;
    accessToken: string;
    refreshToken: string;
    principals?: [string];
}

const UserSchema = new Schema<User>({
    discordId: {
        type: Schema.Types.String,
        required: true,
        unique: true,
    },
    accessToken: {
        type: Schema.Types.String,
        required: true,
    },
    refreshToken: {
        type: Schema.Types.String,
        required: true,
    },
    principals: [Schema.Types.String],
});

export default model<User>("users", UserSchema);
