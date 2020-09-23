import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";
import config from "../config/config";

const secret = config.JWT_SECRET; // for test add to env later

interface IUserRequest extends Request {
    user: any ;
    token:string;
    }

const auth = async (req: IUserRequest, res: Response, next: NextFunction) => {
    
    try {
        const token: any = req.headers.authorization?.split(" ")[1];
        //console.log(token);
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({
            username: (decoded as any).username,
            "tokens.token": token
        });
        if (!user) {
            throw new Error();
        }
        req.user = user;
        req.token = token;
        next()
    } catch (e) {
        res.status(401).send({
            error: "Not Authenticated"
        });
    }
};

export default auth;
