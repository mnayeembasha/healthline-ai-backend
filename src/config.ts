import dotenv from "dotenv";
dotenv.config();

export const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD;
export const PORT = process.env.PORT || 3000;
export const MONGO_URL = process.env.MONGO_URL;
