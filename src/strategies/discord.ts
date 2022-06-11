import { Profile, Strategy } from "passport-discord";
import passport from "passport";
import { VerifyCallback } from "passport-oauth2";
import { User } from "../database/schemas";

passport.serializeUser((user: any, done) => {
    return done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        return user ? done(null, user) : done(null, null);
    } catch (error) {
        return done(error, null);
    }
});

passport.use(
    new Strategy(
        {
            clientID: process.env.DISCORD_OAUTH_CLIENT_ID!,
            clientSecret: process.env.DISCORD_OAUTH_SECRET!,
            callbackURL: process.env.DISCORD_CALLBACK_URL!,
            scope: ["identify"],
        },
        async (
            accessToken: string,
            refreshToken: string,
            profile: Profile,
            done: VerifyCallback
        ) => {
            try {
                const existingUser = await User.findOneAndUpdate(
                    {
                        discordId: profile.id, // we search for discord ids
                    },
                    { accessToken, refreshToken }, // tokens might go stale, so we update them
                    { new: true } // gives back the updated value
                );
                if (existingUser) return done(null, existingUser);
                const newUser = await User.create({
                    discordId: profile.id,
                    accessToken,
                    refreshToken,
                    // we don't have any principals yet
                });
                const savedUser = await newUser.save();
                return done(null, savedUser);
            } catch (error) {
                return done(error as any, undefined);
            }
        }
    )
);
