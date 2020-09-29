import jwt from "jsonwebtoken";
import User, { IUserSchema } from "../models/user";
import { Request, Response, NextFunction } from "express";
import config from "../config/config";

const secret = config.JWT_SECRET; // for test add to env later

interface IUserRequest extends Request {
    user: IUserSchema;
    token: string;
}

const auth = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        const token: any = req.headers.cookie.toString().replace("token=", "");
        console.log(token);
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({
            username: (decoded as any).username,
            "tokens.token": token
        });
        if (!user) {
            throw new Error("Not Authenticated");
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(401).json({ success: false, message: e.message });
    }
};

export default auth;
