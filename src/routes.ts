import { Router, Request, Response } from "express";

import { userController } from "./controllers/userController";
import auth from "./middlewares/auth";

const router = Router();
interface IUserRequest extends Request {
    user: any ;
    token:string;
    }


// User routes
router.post("/users", userController.create);
router.post("/login", userController.login);
router.get("/test", [auth], (req: IUserRequest, res: Response) => {console.log(req.user);res.send(req)});
router.post("/signout",[auth],(req: IUserRequest, res: Response) => {console.log(req.user);res.send(req.user)})

export default router;
