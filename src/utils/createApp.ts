import express, { Express } from "express";
import cors from "cors";
import routes from "../routes";
import session from "express-session";
import passport from "passport";
import store from "connect-mongo";

// for some reason import doesn't work here
require("../strategies/discord");

export function createApp(): Express {
    const app = express();
    // Enable Parsing Middleware for Requests
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Enable CORS
    app.use(
        cors({
            origin: ["http://localhost:3000"],
            credentials: true,
        })
    );

    // Enable Sessions
    app.use(
        session({
            secret: process.env.SESSION_SECRET!,
            resave: false,
            saveUninitialized: false, // won't set session cookie if session object isnt modified
            cookie: {
                maxAge: 60000 * 60, // 1 hour
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
