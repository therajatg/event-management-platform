import express from "express";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/authJWT.js";
import mongoose from "mongoose";
import { Validator } from "./helpers/validator.js";
import { User } from "./models/user.js";
import { compareSync, hashSync } from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
  const validatorResponse = Validator.validateUserInfo(req.body);
  if (validatorResponse.status) {
    const user = new User({
      ...req.body,
      password: hashSync(req.body.password, 8),
    });
    user
      .save()
      .then((res) =>
        res.status(200).json({ message: "User creation successful" })
      )
      .catch((err) => {
        if (err.code === 11000) {
          return res.status(400).json({ message: "Email already present" });
        } else {
          return res.status(500).json({ message: "Internal Server Error" });
        }
      });
  } else {
    res.status(400).json({ message: validatorResponse.message });
  }
});

app.post("/login", (req, res) => {
  const validatorResponse = Validator.validateLoginInfo(req.body);
  if (validatorResponse.status) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = compareSync(req.body.password, user.password);
        if (isPasswordValid) {
          let token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 86400,
          });
          return res.status(200).json({
            message: "Login successful",
            accessToken: token,
            userId: user.id,
          });
        } else {
          return res.status(401).json({ message: "Invalid Password" });
        }
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
      });
  } else {
    res.status(400).json({ message: validatorResponse.message });
  }
});

app.post("/events", verifyToken, (req, res) => {});

app.put("/events/:id", verifyToken, (req, res) => {});

app.post("/events/:id/register", (req, res) => {});

if (process.env.NODE_ENV != "test") {
  try {
    mongoose.connect("mongodb://localhost:27017/eventsdb");
  } catch (error) {
    console.log("Failed while trying to establish connection with mongodb");
  }
}

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("unable to start");
  } else {
    console.log(`Server started on ${process.env.PORT}`);
  }
});
