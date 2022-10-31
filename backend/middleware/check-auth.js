import HttpError from "../models/http-error.js";
import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error("Authenfication failed");
    }
    const decodeToken = jwt.verify(token, "supersecret_don't_share");
    console.log(decodeToken);
    req.userData = { userId: decodeToken.userId };
    next();
  } catch (error) {
    console.log(error);
    const err = new HttpError("Authenfication failed", 401);
    return next(err);
  }
};

export default checkAuth;
