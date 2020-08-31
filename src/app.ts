import express from "express";
import morgan from "morgan";
import fs from "fs";
require("./models/mongoose");

import router from "./routes";
import path from "path";

export const app = express();

const logStream = fs.createWriteStream(path.join(__dirname, "debug.log"));

app.use(express.json());
app.use(router);
app.use(morgan("dev", { stream: logStream }));
