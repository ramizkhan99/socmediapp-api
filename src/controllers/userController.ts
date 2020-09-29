import User from "../models/user";
import IUserSchema from "../models/user"
import { Request, Response } from "express";
import console from "console";

interface IUserRequest extends Request {
    user: any ;
    token:string;
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

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            if (!(await user.validPassword(req.body.password))) {
                return res.status(404).json({ error: "password incorrect" });
            }
            const token = await user.generateAuthToken();
            res.cookie("token", token, {
                httpOnly: true
            });
            res.status(200).json({ id: user._id, token: token });
        } catch (err) {
            console.log(err.message);
            res.status(400).json({ error: err.message });
        }
    },
    signout: async(req: IUserRequest, res: Response)=>{
        
        try{
            await req.user.deleteToken(req.token)
            res.status(200).send("logged out")
            
        }
        catch(err){
            console.log(err)
        }

    },
};
