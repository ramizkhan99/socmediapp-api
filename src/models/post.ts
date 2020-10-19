import { Schema, Document, model } from "mongoose";
import { Int32 } from "mongodb";
import Comment, { ICommentSchema, CommentSchema } from "./comment";

let PostSchema = new Schema(
    {
        authorId: {
            type: String,
            required: true,
        },
        lodash: String,
        authorName: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        genre: {
            type: String,
            required: false,
            default: "General",
        },
        comments: {
            type: CommentSchema,
        },
        likes: {
            type: Number,
        },
    },
    {
        timestamps: true,
    }
);

export interface IPostSchema extends Document {
    authorId: string;
    authorName: string;
    title: string;
    content: string;
    genre: string;
    comments: ICommentSchema[];
    likes: Int32;
    lodash: string;
}

PostSchema.methods.toJSON = function () {
    const post = this;
    const postObject = post.toObject();

    delete postObject.comments;
    delete postObject.content;
    delete postObject.authorId;
    delete postObject._id;
    delete postObject.createdAt;
    delete postObject.updatedAt;

    return postObject;
};

const Post = model<IPostSchema>("Post", PostSchema);

export default Post;
