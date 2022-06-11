import { Router } from "express";
import passport from "passport";
import { verifyMessageController as verifyMessageController } from "../../controllers/auth";
import { isAuthenticated } from "../../utils/middlewares";

const router = Router();

router.get(
    "/discord/redirect",
    passport.authenticate("discord")
    // (req, res) => {
    //     res.sendStatus(200);
    // }
);

router.get("/status", isAuthenticated, (req, res) => {
    res.send(req.user);
});

router.post("/glue/verify", isAuthenticated, verifyMessageController);

export default router;
