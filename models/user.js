import mongoose from "mongoose";

export const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: [true, "Email already exists in the database"],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "{VALUE} is not a valid email!",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
  },
  name: { type: String, required: [true, "Please provide name"] },
  isOrganizer: {
    type: Boolean,
    required: [
      true,
      "Please let us know if you are an organizer or a participant",
    ],
  },
});
