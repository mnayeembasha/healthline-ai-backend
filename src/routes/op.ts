import express, { Request, Response } from "express";
import { opModel } from "../db/models/op";
import { userModel } from "../db/models/user";
import { doctorModel } from "../db/models/doctor";
import { isUserAuthenticated } from "../middleware/user";

const opRouter = express.Router();

/**
 * POST /op/add
 * Add a new OP record
 */
opRouter.post("/add",isUserAuthenticated,async (req: Request, res: Response):Promise<void> => {
  try {
    const { report, userId, doctorId } = req.body;

    // Validate input
    if (!report || !userId || !doctorId) {
       res.status(400).json({ message: "Report, userId, and doctorId are required." });
       return;
    }

    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
       res.status(404).json({ message: "User not found." });
       return;
    }

    // Check if the doctor exists
    const doctor = await doctorModel.findById(doctorId);
    if (!doctor) {
       res.status(404).json({ message: "Doctor not found." });
       return;
    }

    // Create a new OP record
    const newOp = await opModel.create({ report, userId, doctorId });

    res.status(201).json({ message: "OP record created successfully.", op: newOp });
  } catch (error) {
    console.error("Error creating OP record:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

/**
 * GET /op/list
 * Retrieve all OP records with user and doctor details
 */
opRouter.get("/list", async (req: Request, res: Response) => {
  try {
    const ops = await opModel
      .find()
      .populate("userId", "username") // Populate userId with username
      .populate("doctorId", "name specialty"); // Populate doctorId with name and specialty

    res.status(200).json({ ops });
  } catch (error) {
    console.error("Error retrieving OP records:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

/**
 * GET /op/:id
 * Retrieve a single OP record by ID with populated references
 */
opRouter.get("/:id", async (req: Request, res: Response):Promise<void> => {
  try {
    const { id } = req.params;

    const op = await opModel
      .findById(id)
      .populate("userId", "username") // Populate userId with username
      .populate("doctorId", "name specialty"); // Populate doctorId with name and specialty

    if (!op) {
      res.status(404).json({ message: "OP record not found." });
      return;
    }

    res.status(200).json({ op });
  } catch (error) {
    console.error("Error retrieving OP record:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

export default opRouter;
