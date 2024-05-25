import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

export const verifyToken = (req, res, next) => {
  if (req.header && req.headers.authorization) {
    jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          req.user = undefined;
          req.message = "Header verification failed";
          req.status = 403;
          next();
        } else {
          User.findOne({ _id: decoded.id }).then((user) => {
            req.user = user;
            req.message = "Found the user successfully, user has valid token";
            req.status = 200;
            next();
          });
        }
      }
    );
  } else {
    req.user = undefined;
    req.message = "Authorization header not found";
    req.status = 401;
  }
};
