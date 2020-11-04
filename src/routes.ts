import { Router, Request, Response } from "express";
import { postController } from "./controllers/postcontroller";

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

// Blog routes
router
    .route("/blogs")
    .post([auth], postController.create)
    .get(postController.getAllBlogs);

router.get("/blogsbylodash/:lodash", postController.getBlogByLodash);
router.get("/blogsbygenre/:genre",postController.getBlogByGenre)

export default router;
