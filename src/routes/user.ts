import express, { Request, Response } from "express";
import auth from "../middlewares/auth";
import userSchema from "../models/user";

export const router = express.Router();

router.post("/new", async (req: Request, res: Response) => {
    if (!req.body.username || !req.body.password) {
        return res
            .status(400)
            .json({ error: "Username and password is required" });
    }

    const password = req.body.password;
});
