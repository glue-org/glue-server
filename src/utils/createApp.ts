import express, { Express } from "express";
import cors from "cors";
import routes from "../routes";
import session from "express-session";
import passport from "passport";
import store from "connect-mongo";

// initializes the discord passport strategy
require("../strategies/discord");

export function createApp(): Express {
    const app = express();
    // Enable Parsing Middleware for Requests
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Enable CORS
    app.use(
        cors({
            origin: [process.env.DISCORD_CALLBACK_URL!], // change this to the canister URL
            credentials: true,
        })
    );

    // Enable Sessions
    app.use(
        session({
            name: "glue.sid",
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false, // won't set session cookie if session object isnt modified
            cookie: {
                maxAge: 60000 * 60, // 1 hour
                sameSite: "none", // this is required for the cookie to be sent
                secure: true, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie#secure
                // https https://developers.google.com/search/blog/2020/01/get-ready-for-new-samesitenone-secure#:~:text=A%20New%20Model%20for%20Cookie%20Security%20and%20Transparency,-Today%2C%20if%20a&text=Developers%20must%20use%20a%20new,be%20accessed%20over%20HTTPS%20connections.
                // domain: "localhost", // share cookies with subdomains
            },
            store: store.create({ mongoUrl: process.env.MONGO_URL! }),
        })
    );

    // Enable Passport
    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/api", routes);

    return app;
}
