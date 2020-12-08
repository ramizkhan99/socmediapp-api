import { Schema, Document, model, Types } from "mongoose";
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
        summary: {
            type: String,
            required: false,
        },
        genre: {
            type: String,
            required: false,
            default: "General",
        },
        comments: [{
            comment:{
                userid:String,
                firstName:String,
                content:String
            },
        }
        ],
        likes: {
            type: Number,
            default: 0,
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
    summary: string;
    genre: string;
    comments: Types.Array<Object>;
    likes: number;
    lodash: string;
    addComment(comment:any):()=>null;
}
PostSchema.methods.addComment = async function(comment:any) {
    this.comments = this.comments.concat({comment});
    await this.save();

}

PostSchema.methods.toJSON = function () {
    const post = this;
    const postObject = post.toObject();

    //delete postObject.comments;
    delete postObject.content;
    delete postObject.authorId;
    delete postObject._id;
    delete postObject.createdAt;
    delete postObject.updatedAt;

    return postObject;
};

const Post = model<IPostSchema>("Post", PostSchema);

export default Post;
