import mongoose, { Schema, Document } from "mongoose";

interface IHospital {
  name: string;
  address: string;
}

interface IDoctor extends Document {
  name: string;
  specialty: string;
  username: string;
  password: string;
  email: string;
  contact: string;
  location: string;
  availability: string;
  hospital: IHospital;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const doctorSchema = new Schema<IDoctor>(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (email: string) {
          // Validate email format
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: (props) => `${props.value} is not a valid email address.`,
      },
    },
    contact: {
      type: String,
      required: true,
      validate: {
        validator: function (contact: string) {
          // Validate contact number format
          return /^\d{10}$/.test(contact); // Assuming a 10-digit contact number
        },
        message: (props) => `${props.value} is not a valid contact number.`,
      },
    },
    location: { type: String, required: true },
    availability: {
      type: String,
      required: true,
      enum: ["Morning", "Afternoon", "Evening", "Night", "Full-time"],
    },
    hospital: {
      name: { type: String, required: true },
      address: { type: String, required: true },
    },
  },
  { timestamps: true }
);

export const doctorModel = mongoose.model<IDoctor>("Doctor", doctorSchema);
