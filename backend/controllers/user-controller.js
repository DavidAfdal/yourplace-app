import HttpError from "../models/http-error.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { validationResult } from "express-validator";
import User from "../models/user-model.js";
import jwt from "jsonwebtoken";
import { Console } from "console";

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "davidafdal7@gmail.com", // generated ethereal user
    pass: "vpplmptcpqougehc", // generated ethereal password
  },
});

// get data Users
export const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, "-password");
  } catch (error) {
    const err = new HttpError("Something went wrong, could not find users", 500);
    return next(err);
  }
  res.status(200).json(users.map((user) => user.toObject({ getters: true })));
};

// Sign Up
export const signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("invalid Inputs passed please check your data.", 422));
  }

  const { name, email, password } = req.body;
  let exitingUser;
  try {
    exitingUser = await User.findOne({ email: email });
  } catch (error) {
    const err = new HttpError("Sign up failed, please try again later", 500);
    return next(err);
  }

  if (exitingUser) {
    const err = new HttpError("User exits alredy, please login instead", 422);
    return next(err);
  }

  let hashedPassword;

  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new HttpError("Could not create user, please try again", 500);
    return next(err);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    emailToken: crypto.randomBytes(64).toString("hex"),
    isVerified: false,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log(error);
    const err = new HttpError("creating user failed, please try again", 500);
    return next(err);
  }

  let mailOptions = {
    from: ' "Verify your email" <davidafdal7@gmail.com>',
    to: createdUser.email,
    subject: "Verifyed your email",
    html: `<h2> ${createdUser.name} terimakasih sudah register di website saya </h2>
           <h4>Silahkan meverifikasi email anda</h4>
           <a href="http://${req.headers.host}/api/users/verify-email?token=${createdUser.emailToken}"> verify Your Emaillll</a> `,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("verification your email is sent to your gmail account");
    }
  });

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
  });
};

// Login
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  let identifiedUser;

  try {
    const otp = Math.floor(Math.random() * 9000 + 1000);
    identifiedUser = await User.findOneAndUpdate({ email: email }, { otp: otp }, { new: true });
    console.log(identifiedUser);
  } catch (error) {
    const err = new HttpError("login failed, please try again later", 500);
    return next(err);
  }

  if (!identifiedUser) {
    return next(new HttpError("could not idenntify user", 401));
  }

  let isValidPassword = true;
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password);
    console.log(identifiedUser.password);
    console.log(isValidPassword);
  } catch (error) {
    const err = new HttpError("Could not log you in, please check your credentials and try again", 500);
    return next(err);
  }

  if (!isValidPassword) {
    const err = new HttpError("could not idenntify user password", 401);
    return next(err);
  }

  let mailOptions = {
    from: ' "Verify your otp" <davidafdal7@gmail.com>',
    to: identifiedUser.email,
    subject: "Verifyed your Otp",
    html: `<p> your otp ${identifiedUser.otp}</p>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json({
        msg: "succes",
        user: identifiedUser,
      });
    }
  });
};

//verify

export const verify = async (req, res) => {
  try {
    const token = req.query.token;
    const user = await User.findOne({ emailToken: token });
    if (user) {
      user.emailToken = null;
      user.isVerified = true;
      await user.save();
      res.redirect("http://localhost:3000/auth");
    }
  } catch (error) {
    console.log("email is not verifed");
  }
};

export const otp = async (req, res, next) => {
  const userId = req.params.userId;

  let token;

  try {
    const responseData = await User.findOne({ _id: userId });
    token = jwt.sign({ userId: responseData._id, email: responseData.email }, "supersecret_don't_share", { expiresIn: "1h" });
    if (responseData.otp.toString() === req.body.otp && token) {
      res.status(200).json({
        msg: "success",
        data: responseData,
        token: token,
      });
    } else {
      res.status(200).json({
        msg: "failed",
      });
    }
  } catch (error) {
    const err = new HttpError(error, 500);
    return next(err);
  }
};
