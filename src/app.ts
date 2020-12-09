import express from "express";
import session from "express-session";
import morgan from "morgan";
import fs from "fs";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import redis from "redis";
let RedisStore = require("connect-redis")(session);
require("./models/mongoose");

import router from "./routes";
import errorHandler from "./middlewares/errorHandler";

let redisClient = redis.createClient();
redisClient.auth(
    "sWR6TzReNOcotVEDA2YYLnmrT51jcgl5nxtcfii+PxAHjAC+iN7YicrLlcaygmxNPKh2G9UitkugEYsP"
);
export const app: express.Application = express();

const logStream: fs.WriteStream = fs.createWriteStream(
    path.join(__dirname, "debug.log"),
    { flags: "a" }
);

app.use(morgan("combined", { stream: logStream }));
app.use(morgan("dev"));
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(cookieParser());
app.use(
    session({
        name: "commconn",
        secret: "commconn-secret",
        cookie: {
            httpOnly: true,
            secure: true,
            maxAge: 600000,
            sameSite: false,
        },
        store: new RedisStore({
            host: "localhost",
            port: 6379,
            client: redisClient,
            ttl: 86400,
        }),
        saveUninitialized: true,
        resave: false,
    })
);
app.use(express.json());
app.use(router);
app.use(errorHandler);

// For commit to test neko-chan telewire test 1
const sessionid = () => {
    return "thisisit";
};

redisClient.on("error", (err) => {
    console.log("Redis error: ", err);
});

// sWR6TzReNOcotVEDA2YYLnmrT51jcgl5nxtcfii+PxAHjAC+iN7YicrLlcaygmxNPKh2G9UitkugEYsP
