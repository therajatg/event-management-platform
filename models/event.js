import mongoose from "mongoose";

export const eventSchema = new mongoose.Schema({
  title: { type: String, required: [true, "Please provide event title"] },
  description: { type: String, required: [true, "Please provide description"] },
  date: { type: Date, required: [true, "Please provide the event date"] }, //I think it already contains the time but will worry abiut this later
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created: { type: Date, default: Date.now() }, //so that I can sort before sending to the frontend
});

//Organizers can also attend events
