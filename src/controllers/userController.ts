import User, { IUserSchema } from "../models/user";
import { Request, Response } from "express";

interface IUserRequest extends Request {
    user: IUserSchema;
    token: string;
    username: string;
}

export const userController = {
    create: async (req: Request, res: Response) => {
        if (!req.body.username || !req.body.password || !req.body.email) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }

        let user = new User(req.body);

        try {
            await user.save();
            res.status(201).json({ message: "User successfully created" });
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    login: async (req: Request, res: Response) => {
        try {
            let user = await User.findOne({
                username: req.body.username
            });

            if (!(user || user.validPassword(req.body.password))) {
                return res.status(404).json({
                    success: false,
                    message: "Invalid username or password"
                });
            }
            const token = await user.generateAuthToken();
            res.cookie("token", token, {
                httpOnly: true
            });
            res.status(200).json({
                id: user._id,
                token: token,
                username: user.username
            });
        } catch (err) {
            res.status(400).json({ success: false, error: err.message });
        }
    },
    signout: async (req: IUserRequest, res: Response) => {
        try {
            req.user.deleteToken(req.token);
            res.status(200).send({
                success: true,
                message: "Logged out successfully"
            });
        } catch (err) {
            res.status(400).json({ success: false, message: err.message });
        }
    }
};
