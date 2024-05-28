import mongoose from "mongoose";
import dotenv from "dotenv";

mongoose.Promise = global.Promise;
dotenv.config();

const disableMongoHooks = process.env.RUN_MONGO_HOOKS === "false";

beforeEach((done) => {
  if (disableMongoHooks) {
    return done();
  }
  console.log("Running before each unit test");
  mongoose.connection.collections.events.drop(() => {
    mongoose.connection.collections.users.drop(() => {
      done();
    });
  });
});

before((done) => {
  if (disableMongoHooks) {
    return done();
  }
  console.log("Running before all unit tests");
  try {
    mongoose.connect("mongodb://localhost:27017/eventsTestDB");
    console.log("successfully connected to DB");
    done();
  } catch (error) {
    console.log("Failed while connecting with MongoDB");
    done();
  }
});

afterEach((done) => {
  if (disableMongoHooks) {
    return done();
  }
  console.log("Running after each unit test");
  mongoose.connection.collections.events.drop(() => {
    mongoose.connection.collections.users.drop(() => {
      done();
    });
  });
});

after((done) => {
  if (disableMongoHooks) {
    return done();
  }
  console.log("Running after all unit tests");
  mongoose.disconnect();
  done();
});
