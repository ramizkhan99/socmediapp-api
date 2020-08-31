"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var crypto_1 = __importDefault(require("crypto"));
var mongodb_1 = require("mongodb");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var secret = "test1234"; // for test add to env later
var UserSchema = new mongoose_1.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
        match: [/^[a-zA-Z0-9]+$/, "is invalid"],
        index: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        match: [/\S+@\S+\.\S+/, "is invalid"],
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: String,
    avatar: Buffer,
    salt: String,
    location: String,
    active: {
        type: Boolean,
        default: false,
    },
    posts: [{ type: mongodb_1.ObjectID }],
    likedPost: [{ type: mongodb_1.ObjectID }],
    tokens: [
        {
            token: {
                type: String,
            },
        },
    ],
}, {
    timestamps: true,
});
UserSchema.plugin(mongoose_unique_validator_1.default, { message: "is already taken." });
function hashPassword(password) {
    var salt = crypto_1.default.randomBytes(16).toString("hex");
    return {
        password: crypto_1.default
            .pbkdf2Sync(password, salt, 8, 128, "sha512")
            .toString("hex"),
        salt: salt,
    };
}
UserSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        var hash = hashPassword(this.password);
        this.password = hash.password;
        this.salt = hash.salt;
    }
    next();
});
UserSchema.methods.validPassword = function (password) {
    console.log(this);
    var hash = crypto_1.default
        .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
        .toString("hex");
    return this.hash === hash;
};
UserSchema.methods.generateAuthToken = function () {
    return __awaiter(this, void 0, void 0, function () {
        var accessToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    accessToken = jsonwebtoken_1.default.sign({ username: this.username }, secret, {
                        expiresIn: "60m",
                    });
                    this.tokens = this.tokens.concat({ token: accessToken });
                    return [4 /*yield*/, this.save()];
                case 1:
                    _a.sent();
                    return [2 /*return*/, accessToken];
            }
        });
    });
};
exports.default = mongoose_1.model("User", UserSchema);
