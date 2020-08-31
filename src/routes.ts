import { Router } from "express";

import { userController } from "./controllers/userController";

const router = Router();

// User routes
router.post("/user/new", userController.create);
router.post("/user/login", userController.login);

export default router;
