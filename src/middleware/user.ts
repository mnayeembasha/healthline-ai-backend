import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import {  JWT_USER_PASSWORD } from "../config";

export interface JwtWithId extends JwtPayload {
  id: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtWithId;
}

export const isUserAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    // Check if authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        message: "Authorization token is required.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Verify the token
    const decodedData = jwt.verify(token, JWT_USER_PASSWORD);

    // Type guard to check if decodedData has the 'id' field
    if (typeof decodedData === "object" && "id" in decodedData) {
      req.user = decodedData as JwtWithId; // Assign the decoded data to req.user
      next();
    } else {
      res.status(401).json({
        message: "Invalid or expired token.",
      });
    }
  } catch (error) {
    res.status(401).json({
      message: "Invalid or expired token.",
      error: error instanceof Error ? error.message : "An unknown error occurred.",
    });
  }
};
