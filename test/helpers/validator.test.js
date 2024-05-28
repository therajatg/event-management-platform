import { expect } from "chai";
import { Validator } from "../../helpers/validator.js";

describe("Testing the validate userInfo functionality", () => {
  let userInfo;
  beforeEach((done) => {
    userInfo = {
      email: "some@gmail.com",
      password: "1234567",
      name: "rohit",
      isOrganizer: false,
    };
    done();
  });

  it("1. Validating the user info - validates the user info successfully", (done) => {
    let response = Validator.validateUserInfo(userInfo);
    expect(response.status).eq(true);
    expect(response.message).eq("Validated Successfully");
    done();
  });

  it("2. Validating the user info - fails if the name is an empty string", (done) => {
    userInfo.name = "";
    let response = Validator.validateUserInfo(userInfo);
    expect(response.status).eq(false);
    expect(response.message).eq("User info is malformed");
    done();
  });

  it("3. Validating the user info - fails if email id is not correct", (done) => {
    userInfo.email = "hh@h@aw.com";
    let response = Validator.validateUserInfo(userInfo);
    expect(response.status).eq(false);
    expect(response.message).eq("User info is malformed");
    done();
  });

  it("4. Validating the user info - fails if the password is not present", (done) => {
    userInfo.password = null;
    let response = Validator.validateUserInfo(userInfo);
    expect(response.status).eq(false);
    expect(response.message).eq("User info is malformed");
    done();
  });

  it("5. Validating the user info - fails if the isOrganizer is a string", (done) => {
    userInfo.isOrganizer = "edwedw";
    let response = Validator.validateUserInfo(userInfo);
    expect(response.status).eq(false);
    expect(response.message).eq("User info is malformed");
    done();
  });
});

describe("Testing the validate eventInfo functionality", () => {
  let eventInfo;

  beforeEach((done) => {
    eventInfo = {
      title: "Test event title",
      description: "Test event description",
      date: "2099-01-01", //I think it already contains the time but will worry abiut this later
      participants: ["6651dcb377cc599c19045edb"],
      organizer: "6651dcb377cc599c19045edb",
    };
    done();
  });

  it("6. Validating the event info - validates the event info successfully", (done) => {
    let response = Validator.validateEventInfo(eventInfo);
    expect(response.status).eq(true);
    expect(response.message).eq("Validated Successfully");
    done();
  });

  it("7. Validating the event info - fails if no title is present", (done) => {
    eventInfo.title = null;
    let response = Validator.validateEventInfo(eventInfo);
    expect(response.status).eq(false);
    expect(response.message).eq("Event info is malformed");
    done();
  });

  it("8. Validating the event info - fails if the date is invalid", (done) => {
    eventInfo.date = "2021-02-02";
    let response = Validator.validateEventInfo(eventInfo);
    expect(response.status).eq(false);
    expect(response.message).eq("Event info is malformed");
    done();
  });

  it("9. Validating the event info - fails if the participants is not an array", (done) => {
    eventInfo.participants = "6651f4d94e30dd91ff9c5fc6";
    let response = Validator.validateEventInfo(eventInfo);
    expect(response.status).eq(false);
    expect(response.message).eq("Event info is malformed");
    done();
  });

  it("10. Validating the event info - fails if the organizer id is invalid", (done) => {
    eventInfo.organizer = "6651f4d94e30dd91ff9c5fc";
    let response = Validator.validateEventInfo(eventInfo);
    console.log(response);
    expect(response.status).eq(false);
    expect(response.message).eq("Event info is malformed");
    done();
  });
});
