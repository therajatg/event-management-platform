import express from "express";
import dotenv from "dotenv";
import { verifyToken } from "./middleware/authJWT";

dotenv.config();
const app = express();
app.use(express.json());

app.post("/register", (req, res) => {});

app.post("/login", (req, res) => {});

app.post("/events", verifyToken, (req, res) => {});

app.put("/events/:id", verifyToken, (req, res) => {});

app.post("/events/:id/register", (req, res) => {});

app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log("unable to start");
  } else {
    console.log(`Server started on ${process.env.PORT}`);
  }
});
