import { NextFunction, Request, Response } from "express";
import NotFoundError from "../errors/NotFound";
import Post, { IPostSchema } from "../models/post";
import User, { IUserSchema } from "../models/user";
import { kebabCase } from "lodash";
import { ICommunitySchema } from "../models/community";

interface ICommunityRequest extends Request {
    body: ICommunitySchema;
}

export const communityController = {};
