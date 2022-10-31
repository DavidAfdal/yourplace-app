import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
    emailToken: { type: String },
    isVerified: { type: Boolean },
    image: { type: String, required: true },
    otp: { type: Number, default: 0 },
    places: [{ type: mongoose.Types.ObjectId, required: true, ref: "Places" }],
  },
  { timestamp: true }
);
userSchema.plugin(uniqueValidator);
export default model("User", userSchema);
