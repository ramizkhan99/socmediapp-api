import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";

const secret = "test1234"; // for test add to env later

const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token: any = req.headers.authorization?.split(" ")[1];
        const decoded = jwt.verify(token, secret);
        const user = await User.findOne({
            username: (decoded as any).username,
            "tokens.token": token,
        });
        if (!user) {
            throw new Error();
        }
        
        res.status(200).send({
            token: token,
            user: user,
        });
        next();
    } catch (e) {
        res.status(401).send({
            error: "Not Authenticated",
        });
    }
};

export default auth;
