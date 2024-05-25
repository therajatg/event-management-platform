import mongoose from "mongoose";

export class Validator {
  static validateUserInfo(userInfo) {
    if (
      userInfo.hasOwnProperty("name") &&
      userInfo.hasOwnProperty("email") &&
      userInfo.hasOwnProperty("password") &&
      userInfo.hasOwnProperty("isOrganizer") &&
      typeof userInfo.name === "string" &&
      typeof userInfo.email === "string" &&
      typeof userInfo.password === "string" &&
      typeof userInfo.isOrganizer === "boolean" &&
      userInfo.name.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userInfo.email)
    ) {
      return { status: true, message: "Validated Successfully" };
    } else {
      return { status: false, message: "User info is malformed" };
    }
  }

  static validateEventInfo(eventInfo) {
    if (
      eventInfo.hasOwnProperty("title") &&
      eventInfo.hasOwnProperty("description") &&
      eventInfo.hasOwnProperty("date") &&
      eventInfo.hasOwnProperty("participants") &&
      eventInfo.hasOwnProperty("organizer") &&
      typeof eventInfo.title === "string" &&
      typeof eventInfo.description === "string" &&
      Validator.isValidParticipants(eventInfo.participants) &&
      Validator.isValidObjectId(eventInfo.organizer) &&
      Validator.validateDate(eventInfo.date)
    ) {
      return { status: true, message: "Validated Successfully" };
    } else {
      return { status: false, message: "Event info is malformed" };
    }
  }

  static validateDate(date) {
    const parsedDate = Date.parse(date);
    if (isNaN(parsedDate)) {
      return false;
    }
    const currentDate = new Date();
    const eventDate = new Date(parsedDate);
    return eventDate >= currentDate;
  }

  static isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
  }

  static isValidParticipants(participants) {
    if (!Array.isArray(participants)) {
      return false;
    } else if (participants.length > 0) {
      for (let id in participants) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          return false;
        }
      }
    }
    return true;
  }

  static validateLoginInfo(emailAndPassword) {
    if (
      emailAndPassword.hasOwnProperty("email") &&
      emailAndPassword.hasOwnProperty("password") &&
      typeof emailAndPassword.email === "string" &&
      typeof emailAndPassword.password === "string"
    ) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailAndPassword.email)) {
        return { status: false, message: "Invalid Email" };
      } else if (emailAndPassword.password.trim() === "") {
        return { status: false, message: "Invalid Password" };
      } else {
        return { status: true, message: "Valid Credentials" };
      }
    } else {
      return { status: false, message: "Invalid Credentials" };
    }
  }
}

//Since I am validating email at the database level, no need to validate here but then I am validating all other things at the database level too. but I think that although I am checking there, I should also check here. yes twice checks.
