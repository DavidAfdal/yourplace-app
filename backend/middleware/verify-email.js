import User from "../models/user-model.js";

export const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user.isVerified) {
      next();
    } else {
      res.status(200).json({ msg: "your email not verified" });
    }
  } catch (error) {
    console.log(error);
  }
};
