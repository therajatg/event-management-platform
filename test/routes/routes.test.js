import { use, expect } from "chai";
import chaiHttp from "chai-http";
import { app as server } from "../../index.js";
import jwt from "jsonwebtoken";
mongoose.Promise = global.Promise;
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({ path: ".env.test" });

const chai = use(chaiHttp);

use(chaiHttp);

describe("Testing all routes with actual MongoDB calls", () => {
  beforeEach((done) => {
    console.log("Running before each unit test");
    mongoose.connection.collections.events.drop(() => {
      mongoose.connection.collections.users.drop(() => done());
    });
  });

  before((done) => {
    console.log("Running before all unit tests");
    try {
      mongoose.connect(process.env.MONGO_URI_TEST);
      console.log("successfully connected to DB");
      done();
    } catch (error) {
      console.log("Failed while connecting with MongoDB");
      done();
    }
  });

  afterEach((done) => {
    console.log("Running after each unit test");
    mongoose.connection.collections.events.drop(() => {
      mongoose.connection.collections.users.drop(() => done());
    });
  });

  after((done) => {
    console.log("Running after all unit tests");
    mongoose.disconnect();
    done();
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
      console.log("I am here testing if here data is being cleared again");
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          if (err) if (err) return done(err);
          //   if (res)
          chai
            .request(server)
            .post("/register")
            .send(signupBody)
            .end((err, res) => {
              //   console.log("Is this being executed at all");
              if (err) return done(err);
              expect(res.status).eq(400);
              expect(res.body.message).eq("Email already present");
              //   console.log(
              //     "I am here testing if here data is being cleared again"
              //   );
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

    let loginBody = {
      email: "some@gmail.com",
      password: "1234567",
    };

    beforeEach((done) => {
      chai
        .request(server)
        .post("/register")
        .send(signupBody)
        .end((err, res) => {
          done();
        });
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
  });
});
