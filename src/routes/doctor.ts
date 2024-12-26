import express, { Request, Response } from "express";
import { doctorModel } from "../db/models/doctor";

const doctorRouter = express.Router();

// Route to authenticate a doctor
doctorRouter.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    // Validate request body
    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    const doctor = await doctorModel.findOne({ username, password });

    // Check if doctor exists
    if (!doctor) {
      res.status(404).json({ message: "Doctor not found." });
      return;
    }

    res.status(200).json({ message: "Doctor found.", doctor: doctor?.username });
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error", error: err });
  }
});

export default doctorRouter;
