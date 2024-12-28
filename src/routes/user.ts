import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { userModel } from "../db/models/user";
import { JWT_USER_PASSWORD } from "../config";
import { AuthenticatedRequest, isUserAuthenticated } from "../middleware/user";
import { opModel } from "../db/models/op";

const userRouter = express.Router();

// Route to sign up a new user
userRouter.post("/signup", async (req: Request, res: Response):Promise<void> => {
  try {
    const { username, password,photo,location } = req.body;

    // Validate request body
    if (!username || !password) {
       res.status(400).json({ message: "Username and password are required." });
       return
    }

    // Check if the username already exists
    const existingUser = await userModel.findOne({ username });
    if (existingUser) {
       res.status(400).json({ message: "Username already taken." });
       return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if(photo && location){
      const newUser = await userModel.create({ username, password: hashedPassword,photo,location });
      res.status(201).json({ message: "User created successfully.", user: { username: newUser.username } });
      return;
    }
    if(photo){
      const newUser = await userModel.create({ username, password: hashedPassword,photo });
      res.status(201).json({ message: "User created successfully.", user: { username: newUser.username } });
      return;
    }
    if(location){
      const newUser = await userModel.create({ username, password: hashedPassword,location });
      res.status(201).json({ message: "User created successfully.", user: { username: newUser.username } });
      return;
    }
    // If photo is not available
    const newUser = await userModel.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User created successfully.", user: { username: newUser.username } });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

// Route to sign in a user
userRouter.post("/signin", async (req: Request, res: Response):Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
       res.status(400).json({ message: "Username and password are required." });
       return
    }

    // Find the user by username
    const user = await userModel.findOne({ username });
    if (!user) {
      res.status(404).json({ message: "Username is incorrect." });
      return;
    }

    // Compare the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
       res.status(401).json({ message: "Password is incorrect." });
       return;
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD, { expiresIn: "1h" });

    res.status(200).json({ message: "User signed in successfully.", token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});
userRouter.get("/profile",isUserAuthenticated,async (req:AuthenticatedRequest,res:Response)=>{
  try{
    const user = await userModel.findById(req.user?.id);
    res.status(200).json({message:"User Profile",user:user});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

userRouter.get("/:userId/reports", isUserAuthenticated, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {id:userId} = req.user?.id;

    // Validate userId
    if (!userId) {
      res.status(400).json({ message: "Doctor ID is required." });
      return;
    }

    // Fetch all reports associated with the doctor
    const allReports = await opModel.find({ userId }).populate("userId", "username").exec();

    if (!allReports.length) {
      res.status(404).json({ message: "No reports found for the given doctor ID." });
      return;
    }

    // Separate pending and solved reports
    const pendingReports = allReports.filter((report) => report.status === "pending");
    const solvedReports = allReports.filter((report) => report.status === "solved");

    // Sort pending reports by severity in descending order
    pendingReports.sort((a, b) => b.severity - a.severity);

    // Respond with the data
    res.status(200).json({
      message: "Reports fetched successfully.",
      reports: {
        pending: pendingReports,
        solved: solvedReports,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});
  export default userRouter;