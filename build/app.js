"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
var express_1 = __importDefault(require("express"));
var morgan_1 = __importDefault(require("morgan"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
require("./models/mongoose");
var routes_1 = __importDefault(require("./routes"));
exports.app = express_1.default();
var logStream = fs_1.default.createWriteStream(path_1.default.join(__dirname, "debug.log"));
exports.app.use(express_1.default.json());
exports.app.use(routes_1.default);
exports.app.use(cookie_parser_1.default());
exports.app.use(morgan_1.default("dev", { stream: logStream }));
