import { Router } from "express";
import passport from "passport";
import { isAuthenticated } from "../../utils/middlewares";

const router = Router();

router.get(
    "/discord/redirect",
    passport.authenticate("discord"),
    (req, res) => {
        res.send({ msg: "success" });
    }
);

router.get("/discord", passport.authenticate("discord"), (req, res) => {
    res.sendStatus(200);
});

router.get("/status", isAuthenticated, (req, res) => {
    res.sendStatus(200);
});

router.get("/glue/signature", isAuthenticated, (req, res) => {
    res.sendStatus(200);
});

export default router;
