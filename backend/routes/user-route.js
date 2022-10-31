import express from "express";
import { check } from "express-validator";
import { getUsers, login, signUp, verify, otp } from "../controllers/user-controller.js";
import fileUpload from "../middleware/file-upload.js";
import { verifyEmail } from "../middleware/verify-email.js";
const router = express.Router();

router.get("/", getUsers);
router.get("/verify-email", verify);
router.post("/signup", fileUpload.single("image"), [check("name").not().isEmpty(), check("email").normalizeEmail().isEmail(), check("password").isLength({ min: 6 })], signUp);
router.post("/login", verifyEmail, login);
router.post("/login/otp/:userId", otp);

export default router;
