import userSchema from "../models/user";
import { Request, Response } from "express";
import console from "console";

export const userController = {
    create: async (req: Request, res: Response) => {
        if (!req.body.username || !req.body.password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }
    },
    login: async (req: Request, res: Response) => {
        if (!req.body.username || !req.body.password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }

        let user = await userSchema.findOne({
            username: req.body.username,
            password: req.body,
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({
            id: user._id,
        });
    },
};
