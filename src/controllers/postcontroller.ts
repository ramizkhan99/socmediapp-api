import { NextFunction, Request, Response } from "express";
import NotFoundError from "../errors/NotFound";
import Post, { IPostSchema } from "../models/post";
import { IUserSchema } from "../models/user";
import { kebabCase } from "lodash";

interface IPostRequest extends Request {
    body: IPostSchema;
    user: IUserSchema;
}

export const postController = {
    create: async (req: IPostRequest, res: Response, next: NextFunction) => {
        try {
            let post = new Post(req.body);
            let url = "@"+req.user.username+"/"+kebabCase(req.body.title)
            post.authorId = req.user._id;
            post.authorName = req.user.username;
            post.lodash = kebabCase(req.body.title)
            await post.save();
            res.status(201).json({
                success: true,
                message: "Post added successfully",
            });
        } catch (err) {
            next(err);
        }
    },
    getAllBlogs: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if(req.query){
                const posts = await Post.find(req.query).sort([["createdAt", -1]]);
                if (!posts) throw new NotFoundError("No posts found");
                let postObjects: Object[] = [];
                posts.map((post) => postObjects.push(post.toJSON()));
                res.status(200).json({ success: true, posts: postObjects });

            }
            else{
                const posts = await Post.find().sort([["createdAt", -1]]);
                if (!posts) throw new NotFoundError("No posts found");
                let postObjects: Object[] = [];
                posts.map((post) => postObjects.push(post.toJSON()));
                res.status(200).json({ success: true, posts: postObjects });

            }

        } catch (err) {
            next(err);
        }
    },
    getBlogByLodash: async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const post = await Post.findOne({
                lodash: req.params.lodash,
            }).lean();
            if (!post) throw new NotFoundError("Post not found");
            delete post._id;
            delete post.authorId;
            res.status(200).json({ success: true, post: post });
        } catch (err) {
            next(err);
        }
    },
    modifyBlog: async (
        req: IPostRequest,
        res: Response,
        next: NextFunction

    ) =>{
        try {
            
            const filter = {
                lodash: req.params.lodash,
                authorId:req.user._id
                }
            const result = await Post.updateOne(filter,req.body)
            if(result.n===0)    throw new NotFoundError("Post cannot be modified");
            console.log(result)
            res.status(200).json({
                success: true,
                message: "Post Modified Successfully",
            });

            
        } catch (err) {
            next(err);
        }

    }
    
};
