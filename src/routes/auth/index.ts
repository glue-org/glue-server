import { Router } from "express";
import passport from "passport";
import { verifySignature } from "../../controllers/auth";
import { isAuthenticated } from "../../utils/middlewares";

const router = Router();

router.get(
    "/discord/redirect",
    passport.authenticate("discord"),
    (req, res) => {
        res.redirect("http://localhost:3001");
    }
);

router.get("/discord", passport.authenticate("discord"), (req, res) => {
    res.sendStatus(200);
});

router.get("/status", isAuthenticated, (req, res) => {
    res.sendStatus(200);
});

router.get("/glue/signature", isAuthenticated, verifySignature);

export default router;
