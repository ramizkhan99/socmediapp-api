import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import crypto, { BinaryLike } from "crypto";
import { ObjectID } from "mongodb";
import jwt from "jsonwebtoken";

const secret = "test1234"; // for test add to env later

let UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: [true, "can't be blank"],
            match: [/^[a-zA-Z0-9]+$/, "is invalid"],
            index: true,
        },
        email: {
            type: String,
            unique: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, "is invalid"],
            index: true,
        },
        avatar: Buffer,
        hash: String,
        salt: String,
        createDate: Date,
        lastLogin: Date,
        location: String,
        active: Boolean,
        posts: [{ type: ObjectID }],
        likedPost: [{ type: ObjectID }],
        tokens: [
            {
                token: {
                    type: String,
                },
            },
        ],
    },
    {
        timestamps: true,
    }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.methods.setPassword = function (password: BinaryLike) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 8, 128, "sha512")
        .toString("hex");
};

UserSchema.methods.validPassword = function (password: BinaryLike) {
    const hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
    return this.hash === hash;
};

UserSchema.methods.generateAuthToken = async function () {
    const accessToken = jwt.sign({ username: this.username }, secret, {
        expiresIn: "60m",
    });

    this.tokens = this.tokens.concat({ token: accessToken });
    await this.save();
    return accessToken;
};

export default mongoose.model("User", UserSchema);
