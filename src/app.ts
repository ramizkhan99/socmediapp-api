import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
require("./models/mongoose");

import router from "./routes";

export const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, "debug.log"));

app.use(cors());
app.use(express.json());
app.use(router);
app.use(cookieParser());
app.use(morgan("dev", { stream: logStream }));

// For commit to test neko-chan telewire test 1
