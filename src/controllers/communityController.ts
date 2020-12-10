import { NextFunction, Request, Response } from "express";
import NotFoundError from "../errors/NotFound";
import Post, { IPostSchema } from "../models/post";
import User, { IUserSchema } from "../models/user";
import { kebabCase } from "lodash";
import Community, { ICommunitySchema } from "../models/community";

interface ICommunityRequest extends Request {
    body: ICommunitySchema;
    user: IUserSchema;
}

export const communityController = {
    create: async (
        req: ICommunityRequest,
        res: Response,
        next: NextFunction
    ) => {
        try {
            let community = new Community(req.body);
            community.admins.concat(req.user);
            community.lodash = kebabCase(req.body.name);
            await community.save();
            res.status(201).json({
                success: true,
                message: "Community created successfully",
                community,
            });
        } catch (e) {
            next(e);
        }
    },

    getCommunities: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (req.query) {
                const communities = await Community.find(req.query).sort([
                    ["createdAt", -1],
                ]);
                if (!communities)
                    throw new NotFoundError("No communities found");
                let communityObjects: Object[] = [];
                communities.forEach((community) =>
                    communityObjects.push(community.toJSON())
                );
                res.status(200).json({ success: true, communities });
            } else {
                const communities = await Community.find().sort([
                    ["createdAt", -1],
                ]);
                if (!communities)
                    throw new NotFoundError("No communities found");
                let communityObjects: Object[] = [];
                communities.forEach((community) =>
                    communityObjects.push(community.toJSON())
                );
                res.status(200).json({ success: true, communities });
            }
        } catch (e) {
            next(e);
        }
    },
};
