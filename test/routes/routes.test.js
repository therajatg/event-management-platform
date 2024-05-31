import { use, expect } from "chai";
import chaiHttp from "chai-http";
import { app as server } from "../../index.js";
import jwt from "jsonwebtoken";
mongoose.Promise = global.Promise;
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../../models/user.js";
import { Event } from "../../models/event.js";
dotenv.config({ path: ".env.test" });

const chai = use(chaiHttp);

use(chaiHttp);

describe("Testing all routes with actual MongoDB calls", () => {
  beforeEach((done) => {
    console.log("Running before each test");
    User.deleteMany({})
      .then(Event.deleteMany({}).then(() => done()))
      .catch((err) => done(err));
    // mongoose.connection.collections.users.drop().then(() => done());
  });

  before((done) => {
    console.log("Running before all unit tests");
    mongoose
      .connect(process.env.MONGO_URI_TEST)
      .then(() => {
        console.log("successfully connected to DB");
        done();
      })
      .catch((error) => {
        console.log("Failed while connecting with MongoDB");
        done(error);
      });
  });

  afterEach((done) => {
    console.log("Running after each test");
    User.deleteMany({})
      .then(Event.deleteMany({}).then(() => done()))
      .catch((err) => done(err));
    // mongoose.connection.collections.users.drop().then(() => done());
  });

  after((done) => {
    mongoose.disconnect().then(() => done());
  });

  describe("Verifies the signup flow", () => {
    let signupBody;
    beforeEach((done) => {
      signupBody = {
        email: "some@gmail.com",
        password: "1234567",
        name: "rohit",
        isOrganizer: false,
      };
      done();
    });

    it("1. Successful signup of the user", (done) => {
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          expect(res.status).eq(200);
          expect(res.body.message).eq("User creation successful");
          expect(res.body).to.have.property("user");
          expect(res.body.user).to.not.be.undefined;

          done();
        });
    });

    it("2. Email verification fails", (done) => {
      signupBody.email = "ssss@ss@gmail.com";
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          expect(res.status).eq(400);
        });
      done();
    });

    it("3. Failure when the user is already registered", (done) => {
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          if (err) if (err) return done(err);
          chai
            .request(server)
            .post("/register")
            .send(signupBody)
            .end((err, res) => {
              if (err) return done(err);
              expect(res.status).eq(400);
              expect(res.body.message).eq("Email already present");
              done();
            });
        });
    });
  });

  describe("Verifies the login flow", () => {
    let signupBody = {
      email: "some@gmail.com",
      password: "1234567",
      name: "rohit",
      isOrganizer: false,
    };

    let loginBody;

    beforeEach((done) => {
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          done();
        });

      loginBody = {
        email: "some@gmail.com",
        password: "1234567",
      };
    });

    it("4. Successful login by the user", (done) => {
      chai
        .request(server)
        .post("/login")
        .send(loginBody)
        .end((err, res) => {
          expect(res.status).eq(200);
          expect(res.body).to.have.property("userId");
          expect(res.body).to.have.property("accessToken");
          expect(res.body.accessToken).to.not.be.undefined;
          done();
        });
    });

    it("5. User login fails if the user email is not found in the database", (done) => {
      loginBody.email = "123@gmail.com";
      chai
        .request(server)
        .post("/login")
        .send(loginBody)
        .end((err, res) => {
          expect(res.status).eq(404);
          expect(res.body.message).eq("User not found");
          done();
        });
    });

    it("6. User login fails if the password is invalid", (done) => {
      loginBody.password = "123";
      chai
        .request(server)
        .post("/login")
        .send(loginBody)
        .end((err, res) => {
          expect(res.status).eq(401);
          expect(res.body.message).eq("Invalid Password");
          done();
        });
    });
  });

  describe("Verifies the event creation flow", () => {
    it("7. Successful event creation by the user", (done) => {
      const signupBody = {
        email: "some@gmail.com",
        password: "1234567",
        name: "rohit",
        isOrganizer: true,
      };
      const loginBody = {
        email: "some@gmail.com",
        password: "1234567",
      };

      const event = {
        title: "Test event title",
        description: "Test event description",
        date: "2025-01-01", //I think it already contains the time but will worry abiut this later
      };

      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((signUpError, signUpResponse) => {
          if (signUpError) return done(signUpError);
          chai
            .request(server)
            .post("/login")
            .send(loginBody)
            .end((loginError, loginResponse) => {
              if (loginError) return done(loginError);
              chai
                .request(server)
                .post("/events")
                .set("authorization", loginResponse.body.accessToken)
                .send(event)
                .end((err, res) => {
                  expect(res.status).equal(200);
                  done();
                });
            });
        });
    });

    it("8. Failure if participant tries to organize an event (Instead of organizer)", (done) => {
      const signupBody = {
        email: "some@gmail.com",
        password: "1234567",
        name: "rohit",
        isOrganizer: false,
      };
      const loginBody = {
        email: "some@gmail.com",
        password: "1234567",
      };

      const event = {
        title: "Test event title",
        description: "Test event description",
        date: "2025-01-01", //I think it already contains the time but will worry abiut this later
      };

      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((signUpError, signUpResponse) => {
          if (signUpError) return done(signUpError);
          chai
            .request(server)
            .post("/login")
            .send(loginBody)
            .end((loginError, loginResponse) => {
              if (loginError) return done(loginError);
              chai
                .request(server)
                .post("/events")
                .set("authorization", loginResponse.body.accessToken)
                .send(event)
                .end((err, res) => {
                  expect(res.status).eq(400);
                  expect(res.body.message).eq(
                    "Participants cannot organize an event"
                  );
                  done();
                });
            });
        });
    });

    it("9. Failure to create an event in case of invalid date", (done) => {
      const signupBody = {
        email: "some@gmail.com",
        password: "1234567",
        name: "rohit",
        isOrganizer: false,
      };
      const loginBody = {
        email: "some@gmail.com",
        password: "1234567",
      };

      const event = {
        title: "Test event title",
        description: "Test event description",
        date: "2025-01-01-01", //I think it already contains the time but will worry abiut this later
      };

      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((signUpError, signUpResponse) => {
          if (signUpError) return done(signUpError);
          chai
            .request(server)
            .post("/login")
            .send(loginBody)
            .end((loginError, loginResponse) => {
              if (loginError) return done(loginError);
              chai
                .request(server)
                .post("/events")
                .set("authorization", loginResponse.body.accessToken)
                .send(event)
                .end((err, res) => {
                  expect(res.status).eq(400);
                  expect(res.body.message).eq("Event info is malformed");
                  done();
                });
            });
        });
    });
  });

  describe("Verifies the event updation flow", () => {
    let participantId;
    beforeEach((done) => {
      const signupBody = {
        email: "a@gmail.com",
        password: "1234567",
        name: "a",
        isOrganizer: false,
      };

      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((signUpError, signUpResponse) => {
          if (signUpError) return done(signUpError);
          participantId = signUpResponse.body.user._id;
          done();
        });
    });

    it("10. Successful event updation by the organizer", (done) => {
      const signupBody = {
        email: "some@gmail.com",
        password: "1234567",
        name: "rohit",
        isOrganizer: true,
      };
      const loginBody = {
        email: "some@gmail.com",
        password: "1234567",
      };

      const event = {
        title: "Test event title",
        description: "Test event description",
        date: "2025-01-05", //I think it already contains the time but will worry abiut this later
        participants: [participantId],
      };

      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((signUpError, signUpResponse) => {
          if (signUpError) return done(signUpError);
          chai
            .request(server)
            .post("/login")
            .send(loginBody)
            .end((loginError, loginResponse) => {
              if (loginError) return done(loginError);
              chai
                .request(server)
                .post("/events")
                .set("authorization", loginResponse.body.accessToken)
                .send(event)
                .end((eventCreationError, eventCreationResponse) => {
                  if (eventCreationError) return done(eventCreationError);
                  chai
                    .request(server)
                    .put(`/events/${eventCreationResponse.body.event._id}`)
                    .set("authorization", loginResponse.body.accessToken)
                    .send({ ...event, participants: [] })
                    .end((eventUpdationError, eventUpdationResponse) => {
                      if (eventUpdationError) return done(eventUpdationError);
                      expect(eventUpdationResponse.status).eq(200);
                      expect(eventUpdationResponse.body.message).eq(
                        "Event updated successfully"
                      );
                      done();
                    });
                });
            });
        });
    });
  });
});
