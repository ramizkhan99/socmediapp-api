import { Router, Request, Response } from "express";

import { userController } from "./controllers/userController";
import auth from "./middlewares/auth";

const router = Router();

// User routes
router.post("/users", userController.create);
router.post("/login", userController.login);
router.get("/test", [auth], (req: Request, res: Response) => {
    res.status(200).send("okay");
});
router.get("/signout", [auth], userController.signout);

export default router;
