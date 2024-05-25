class Validator {
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
      userInfo.name.trim() !== ""
    ) {
      return { status: true, message: "Validated Successfully" };
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return { status: false, message: "Please provide a valid email" };
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
      Array.isArray(eventInfo.participants) &&
      typeof eventInfo.organizer === "string"
    ) {
      return { status: true, message: "Validated Successfully" };
    } else if (!Validator.validateDate(eventInfo.date)) {
      return { status: false, message: "Invalid date" };
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
}

//Since I am validating email at the database level, no need to validate here but then I am validating all other things at the database level too. but I think that although I am checking there, I should also check here. yes twice checks.
