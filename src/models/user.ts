import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
import crypto, { BinaryLike } from "crypto";
import { Binary, Timestamp, ObjectID } from "mongodb";

var UserSchema = new mongoose.Schema(
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
        avatar: Binary,
        hash: String,
        salt: String,
        createDate: Timestamp,
        lastLogin: Timestamp,
        location: String,
        active: Boolean,
        posts: [{ type: ObjectID }],
        likedPost: [{ type: ObjectID }],
    },
    {
        timestamps: true,
    }
);

UserSchema.plugin(uniqueValidator, { message: "is already taken." });

UserSchema.methods.setPassword = function (password: BinaryLike) {
    this.salt = crypto.randomBytes(16).toString("hex");
    this.hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
};

UserSchema.methods.validPassword = function (password: BinaryLike) {
    var hash = crypto
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
    return this.hash === hash;
};

export default mongoose.model("User", UserSchema);
