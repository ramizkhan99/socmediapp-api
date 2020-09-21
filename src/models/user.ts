import { Schema, Types, Document, model, Mongoose } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import crypto, { BinaryLike } from "crypto";
import { ObjectID } from "mongodb";
import jwt from "jsonwebtoken";

const secret = "test1234"; // for test add to env later

let UserSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            match: [/^[a-zA-Z0-9]+$/, "is invalid"],
            index: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            match: [/\S+@\S+\.\S+/, "is invalid"],
            index: true
        },
        password: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: String,
        avatar: Buffer,
        salt: String,
        location: String,
        active: {
            type: Boolean,
            default: false
        },
        posts: [{ type: ObjectID }],
        likedPost: [{ type: ObjectID }],
        tokens: [
            {
                token: {
                    type: String
                }
            }
        ]
    },
    {
        timestamps: true
    }
);

interface IUserSchema extends Document {
    firstName: string;
    lastName?: string;
    username: string;
    password: string;
    avatar?: Types.Buffer;
    salt: string;
    location?: string;
    active: boolean;
    posts: Types.Array<Types.ObjectId>;
    likedPosts: Types.Array<Types.ObjectId>;
    tokens: Types.Array<Object>;
    generateAuthToken(): () => string;
    validPassword(password: string): () => boolean;
}

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.pre<IUserSchema>("save", function (next) {
    if (this.isModified("password")) {
        const hash = hashPassword(this.password);
        this.password = hash.password;
        this.salt = hash.salt;
    }
    next();
});

UserSchema.methods.validPassword = async function (password: BinaryLike) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 8, 128, "sha512")
        .toString("hex");
    return this.password === hash;
};

UserSchema.methods.generateAuthToken = async function () {
    const accessToken = jwt.sign({ username: this.username }, secret, {
        expiresIn: "60m"
    });

    this.tokens = this.tokens.concat({ token: accessToken });
    await this.save();
    return accessToken;
};

const User = model<IUserSchema>("User", UserSchema);
export default User;

function hashPassword(password: BinaryLike) {
    let salt = crypto.randomBytes(16).toString("hex");
    return {
        password: crypto
            .pbkdf2Sync(password, salt, 8, 128, "sha512")
            .toString("hex"),
        salt
    };
}
