import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "./user";
import { IDoctor } from "./doctor";

// Define the interface for the OP document
interface IOp extends Document {
  report: string;
  userId: IUser["_id"]; // Reference to the User model
  doctorId: IDoctor["_id"]; // Reference to the Doctor model
  status: "pending" | "solved"; // Status of the report
  severity:number,
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema for OP
const opSchema = new Schema<IOp>(
  {
    report: { type: String, required: true }, // String field for the report
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true }, // Reference to Doctor
    status: {
      type: String,
      enum: ["pending", "solved"], // Enum to allow only 'pending' or 'solved'
      default: "pending", // Default value is 'pending'
    },
    severity:Number,
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

// Create and export the OP model
export const opModel = mongoose.model<IOp>("Op", opSchema);
