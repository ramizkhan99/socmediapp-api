import User, { IUserSchema } from "../models/user";
import { NextFunction, Request, Response } from "express";
import HttpError from "../errors/HttpError";
import NotFoundError from "../errors/NotFound";
import sharp from "sharp";

interface IUserRequest extends Request {
    user: IUserSchema;
    token: string;
    username: string;
}

export const userController = {
    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.body.username || !req.body.password || !req.body.email) {
                throw new HttpError(400, "Invalid data");
            }

            let user = new User(req.body);

            await user.save();
            res.status(201).json({ message: "User successfully created" });
        } catch (e) {
            next(e);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            let user = await User.findOne({
                username: req.body.username,
            });

            if (!(user || user.validPassword(req.body.password))) {
                throw new NotFoundError("User");
            }
            const token = await user.generateAuthToken();
            res.cookie("token", token, { httpOnly: true });
            res.status(200).json({
                username: user.username,
            });
        } catch (e) {
            next(e);
        }
    },

    signout: async (req: IUserRequest, res: Response, next: NextFunction) => {
        try {
            req.user.deleteToken(req.token);
            res.status(200).send({
                success: true,
                message: "Logged out successfully",
            });
        } catch (e) {
            next(e);
        }
    },

    addAvatar: async (req: IUserRequest, res: Response, next: NextFunction) => {
        try {
            const buffer = await sharp(req.file.buffer)
                .resize({
                    width: 250,
                    height: 250,
                })
                .png()
                .toBuffer();

            req.user.avatar = buffer;
            await req.user.save();
            res.status(200).send();
        } catch (e) {
            next(e);
        }
    },

    removeAvatar: async (
        req: IUserRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            req.user.avatar = null;
            await req.user.save();
            res.status(204).send();
        } catch (e) {
            next(e);
        }
    },

    updateUser: async (
        req: IUserRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const updates = Object.keys(req.body);
            const allowedUpdates = [
                "firstName",
                "lastName",
                "password",
                "username",
            ];
            const isValidUpdate = updates.every((update) =>
                allowedUpdates.includes(update)
            );

            if (!isValidUpdate) throw new HttpError(400, "Invalid updates");

            updates.forEach(
                (update) => ((req.user as any)[update] = req.body[update])
            );
            await req.user.save();
            res.json(req.user);
        } catch (e) {
            next(e);
        }
    },
};
