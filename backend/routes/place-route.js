import express from "express";
import { check } from "express-validator";
import fileUpload from "../middleware/file-upload.js";

import { createPlace, deletePlace, getPlaceById, getPlaceByUserId, getPlaces, updatePlace } from "../controllers/place-controller.js";
import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

router.get("/", getPlaces);
router.get("/:pid", getPlaceById);
router.get("/user/:uid", getPlaceByUserId);
router.use(checkAuth);
router.post("/", fileUpload.single("image"), [check("title").not().isEmpty(), check("description").isLength({ min: 5 }), check("address").not().isEmpty()], createPlace);
router.patch("/:pid", [check("title").not().isEmpty(), check("description").isLength({ min: 5 })], updatePlace);
router.delete("/:pid", deletePlace);

export default router;
