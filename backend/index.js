import express from "express";
import { errorHandler, routhErrorHandler } from "./middleware/placeErrorHandler-middleware.js";
import userRoutes from "./routes/user-route.js";
import placeRoutes from "./routes/place-route.js";
import mongoose from "mongoose";
import path from "path";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(`/uploads/images`, express.static(path.join("uploads", "images")));
app.use(cors());
app.use("/api/places", placeRoutes);
app.use("/api/users", userRoutes);
app.use(routhErrorHandler);
app.use(errorHandler);

mongoose
  .connect("mongodb+srv://David:G3xDOjCmi6DceHxK@cluster0.h64h6yl.mongodb.net/mern?retryWrites=true&w=majority")
  .then(
    app.listen(5000, () => {
      console.log("listening on port 5000");
    })
  )
  .catch((err) => {
    console.log(err);
  });
