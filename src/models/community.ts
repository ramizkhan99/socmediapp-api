import { Schema, Document, model, Types } from "mongoose";
import Post, { IPostSchema } from "./post";
import User, { IUserSchema } from "./user";

let CommunitySchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    lodash: String,
    summary: String,
    posts: {
        type: Post,
    },
    members: {
        type: User,
    },
    admins: [
        {
            type: User,
            required: true,
        },
    ],
    popularity: {
        type: Number,
        default: 0,
        required: true,
    },
});

export interface ICommunitySchema extends Document {
    name: string;
    lodash: string;
    posts?: Types.Array<IPostSchema>;
    members?: Types.Array<IUserSchema>;
    admins: Types.Array<IUserSchema>;
    popularity: number;
    addMember(user: IUserSchema): () => null;
    addPost(post: IPostSchema): () => null;
}

CommunitySchema.methods.addMember = async function (user: IUserSchema) {
    this.members = this.members.concat({ user });
    await this.save();
};

CommunitySchema.methods.addPost = async function (post: IPostSchema) {
    this.posts = this.posts.concat({ post });
    await this.save();
};

CommunitySchema.methods.toJSON = function () {
    const community = this;
    const communityObject = community.toObject();

    delete communityObject.members;
    delete communityObject.posts;
    delete communityObject.admins;
    delete communityObject._id;

    return communityObject;
};

const Community = model<ICommunitySchema>("Community", CommunitySchema);

export default Community;
