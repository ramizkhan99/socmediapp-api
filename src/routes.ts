import { Router, Request, Response } from "express";
import { postController } from "./controllers/postcontroller";

import { userController } from "./controllers/userController";
import auth from "./middlewares/auth";

const router = Router();

declare module "express-session" {
    interface SessionData {
        value: number;
    }
}

router.get("/foo", (req: Request, res: Response) => {
    req.session.value = (req.session.value || 0) + 1;
    res.send("You viewed this page " + req.session.value + " times");
});

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
    .get([auth], postController.getAllBlogs);

router.get("/blogsbylodash/:lodash", postController.getBlogByLodash);
router.patch("/blogsbylodash/:lodash", [auth], postController.modifyBlog);

// Like a blog post
router.get("/blogs/like/:lodash", postController.likePost);

//comment on a blog post
router.post("/blogs/comment/:lodash", [auth], postController.commentPost);

export default router;
