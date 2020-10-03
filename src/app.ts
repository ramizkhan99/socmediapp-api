import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
require("./models/mongoose");

import router from "./routes";
import errorHandler from "./middlewares/errorHandler";

export const app: express.Application = express();

const logStream: fs.WriteStream = fs.createWriteStream(
    path.join(__dirname, "debug.log"),
    { flags: "a" }
);

app.use(morgan("combined", { stream: logStream }));
app.use(morgan("dev"));
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(router);
app.use(errorHandler);

// For commit to test neko-chan telewire test 1
