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

    const organizerExists = await User.exists({ _id: this.organizer });
    if (!organizerExists) {
      const err = { status: 400, message: `Organizer not found` };
      return next(err);
    }

    for (const participantId of this.participants) {
      const participantExists = await User.exists({ _id: participantId });
      if (!participantExists) {
        const err = {
          status: 400,
          message: `participantID: ${participantId} does not exists`,
        };
        return next(err);
      }
    }

    next();
  } catch (error) {
    console.log("this is the error", error);
    next(error);
  }
});

eventSchema.pre("findOneAndUpdate", async function (next) {
  console.log("I am findOneAndUpdate");
  try {
    const User = mongoose.model("User");
    const update = this.getUpdate();

    console.log("this.organizer", update.organizer);
    const organizerExists = await User.exists({ _id: update.organizer });
    if (!organizerExists) {
      const err = { status: 400, message: `Invalid organizer ID` };
      return next(err);
    }

    for (const participantId of update.participants) {
      const participantExists = await User.exists({ _id: participantId });
      if (!participantExists) {
        const err = {
          status: 400,
          message: `Invalid participantID: ${participantId}`,
        };
        return next(err);
      }
    }

    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Organizers can also attend events

export const Event = mongoose.model("Event", eventSchema);

//Now with the validator.js and this I am getting info malformed if 's' is in the end of id (objectId) and content on this page runs and I am getting not found thing if "a" si in the end as enable to catch this in the validator part since this is valid Id, just not present in the database.
