import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
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

eventSchema.pre("save", async function (next) {
  try {
    const User = mongoose.model("User");

    // Check if organizer exists
    const organizerExists = await User.exists({ _id: this.organizer });
    if (!organizerExists) {
      const err = { status: 404, message: `Organizer not found` };
      return next(err);
    }

    // Check if all participants exist
    for (const participantId of this.participants) {
      const participantExists = await User.exists({ _id: participantId });
      if (!participantExists) {
        const err = {
          status: 404,
          message: `Participant with ID ${participantId} not found`,
        };
        return next(err);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

//Organizers can also attend events

export const Event = mongoose.model("Event", eventSchema);
