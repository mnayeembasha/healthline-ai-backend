import dotenv from "dotenv";
dotenv.config();

export const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD as string;
export const JWT_ADMIN_PASSWORD = process.env.JWT_ADMIN_PASSWORD as string;
export const PORT = process.env.PORT || 3000;
export const MONGO_URL = process.env.MONGO_URL;
