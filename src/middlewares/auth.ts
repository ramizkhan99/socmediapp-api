import jwt from "jsonwebtoken";
import User, { IUserSchema } from "../models/user";
import { Request, Response, NextFunction } from "express";
import config from "../config/config";
import HttpError from "../errors/HttpError";
import NotFoundError from "../errors/NotFound";

const secret = config.JWT_SECRET; // for test add to env later

interface IUserRequest extends Request {
    user: IUserSchema;
    token: string;
}

const auth = async (req: IUserRequest, res: Response, next: NextFunction) => {
    try {
        if (typeof req.cookies === "undefined" || !req.cookies.token) {
            throw new HttpError(401, "Not authenticated");
        }
        const token: string = req.cookies.token;
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({
            username: (decoded as any).username,
            "tokens.token": token,
        });
        if (!user) {
            throw new NotFoundError("User");
        }
        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        console.log({ error: e });
        next(e);
    }
};

export default auth;
