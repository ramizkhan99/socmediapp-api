import { Schema, Types, Document, model } from "mongoose";
import { Int32 } from "mongodb";
import Comment, { ICommentSchema } from "./comment";

// TODO: Make Schema for comments instead of using in object
let PostSchema = new Schema(
    {
        authorId: {
            type: String,
            required: true
        },
        authorName: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: false,
            default: "General"
        },
        comments: [Comment],
        likes: {
            type: Int32
        }
    },
    {
        timestamps: true
    }
);

export interface IPostSchema extends Document {
    authorId: String;
    authorName: String;
    title: String;
    content: String;
    genre: String;
    comments: ICommentSchema[];
    likes: Int32;
}

const Post = model<IPostSchema>("Post", PostSchema);

export default Post;
