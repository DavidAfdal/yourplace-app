import HttpError from "../models/http-error.js";
import fs from "fs";

export const errorHandler = (error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500).json({ msg: error.message || "Error!!!!" });
};

export const routhErrorHandler = (req, res, next) => {
  const error = new HttpError("could not find this route", 404);
  throw error;
};
