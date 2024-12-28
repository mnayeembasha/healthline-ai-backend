import express, { Request, Response } from "express";
import { doctorModel } from "../db/models/doctor";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { JWT_ADMIN_PASSWORD } from "../config";
import { isAdminAuthenticated } from "../middleware/admin";
import { opModel } from "../db/models/op";

const doctorRouter = express.Router();

// Route to authenticate a doctor
doctorRouter.post("/signin", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    // Find doctor by username
    const doctor = await doctorModel.findOne({ username });

    if (!doctor) {
      // If doctor with the provided username is not found
      res.status(404).json({ message: "Username is incorrect." });
      return;
    }

    // Compare password using bcrypt
    const isPasswordValid = await bcrypt.compare(password, doctor.password);

    if (!isPasswordValid) {
      // If password is incorrect
      res.status(401).json({ message: "Password is incorrect." });
      return;
    }

    // Generate JWT
    const token = jwt.sign(
      { id: doctor._id }, // Payload
      JWT_ADMIN_PASSWORD, // Secret key
      { expiresIn: "1h" } // Token expiration time
    );

    // Send the JWT to the client
    res.status(200).json({
      message: "Doctor signed in successfully.",
      token,
      doctor: { id: doctor._id, username: doctor.username },
    });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

doctorRouter.get("/dashboard",isAdminAuthenticated,(req:Request,res:Response)=>{
  res.status(200).json({message:"Doctors Dashboard Page"});
});

/**
 * Fetch all reports for a given doctor ID.
 * Displays pending reports in descending order of severity.
 */
doctorRouter.get("/:doctorId/reports", isAdminAuthenticated, async (req: Request, res: Response) => {
  try {
    const { doctorId } = req.params;

    // Validate doctorId
    if (!doctorId) {
      res.status(400).json({ message: "Doctor ID is required." });
      return;
    }

    // Fetch all reports associated with the doctor
    const allReports = await opModel.find({ doctorId }).populate("userId", "username").exec();

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

export default doctorRouter;