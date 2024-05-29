import { use, expect } from "chai";
import chaiHttp from "chai-http";
import { app as server } from "../../index.js";
import jwt from "jsonwebtoken";
mongoose.Promise = global.Promise;
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../../models/user.js";
dotenv.config({ path: ".env.test" });

const chai = use(chaiHttp);

use(chaiHttp);

describe("Testing all routes with actual MongoDB calls", () => {
  beforeEach((done) => {
    console.log("Running before each test");
    User.deleteMany({}).then(() => done());
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
    User.deleteMany({}).then(() => done());
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
});
