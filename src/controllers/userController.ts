import User from "../models/user";
import { Request, Response } from "express";
import console from "console";

export const userController = {
    create: async (req: Request, res: Response) => {
        if (!req.body.username || !req.body.password || !req.body.email) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }

        let user = new User({
            username: req.body.username,
            email: req.body.email,
        });

        try {
            user.schema.methods.setPassword(req.body.password);
            await user.save();
            res.status(201).json({ message: "User successfully created" });
        } catch (err) {
            res.status(400).send(err);
        }
    },

    login: async (req: Request, res: Response) => {
        if (!req.body.username || !req.body.password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }

        let user = await User.findOne({
            username: req.body.username,
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.send(user);

        // try {
        // } catch (err) {}

        // let verified = user.schema.methods.validPassword(req.body.password);
        // if (!verified) {
        //     return res.status(404).json({ error: "password incorrect" });
        // }
        // const token = await user.schema.methods.generateAuthToken();

        // res.cookie("token", user.toObject().tokens[0].token, {
        //     httpOnly: true,
        // });
        // res.status(200).json({ id: user._id, token: token });
    },
};
