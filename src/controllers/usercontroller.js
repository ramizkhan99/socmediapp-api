import User from "../models/user";
import { Request, Response } from "express";
import console from "console";

export const userController = {
    create: async (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }
    },
    login: async (req, res) => {
        if (!req.body.username || !req.body.password) {
            return res
                .status(400)
                .json({ error: "Username and password are required" });
        }

        let user = await User.findOne({
            username: req.body.username
        });
        
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        let verified = user.validPassword(req.body.password)
        if(!verified){
            return res.status(404).json({error:"password incorrect"});
        }
        const token = await user.generateAuthToken();

        res.status(200).json({
            id: user._id,
            token:token,

            
        });
    },
};
