import dotenv from "dotenv";

dotenv.config({ path: "./src/config/.env.dev" });

export default {
    PORT: process.env.PORT || 5000,
    JWT_SECRET: process.env.JWT_SECRET || "testsecret"
};
