import { Document, model, Schema } from "mongoose";

export let CommentSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
});

export interface ICommentSchema extends Document {
    userId: string;
    username: string;
    content: string;
}

export default model<ICommentSchema>("Comment", CommentSchema);
