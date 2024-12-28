import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  password: string;
  photo: string;
  location:string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (username: string) {
          // Validate username format (alphanumeric and at least 4 characters)
          return /^[a-zA-Z0-9]{3,}$/.test(username);
        },
        message: (props) => `${props.value} is not a valid username. Must be alphanumeric and at least 3 characters long.`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: [4, "Password must be at least 4 characters long."],
    },
    photo:{
      type:String
    },
    location:{
      type:String
    }
  },
  { timestamps: true } // Automatically includes createdAt and updatedAt
);

export const userModel = mongoose.model<IUser>("User", userSchema);
