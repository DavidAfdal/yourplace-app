import HttpError from "../models/http-error.js";

import { validationResult } from "express-validator";
import { getCoordsForAddress } from "../util/location.js";
import Place from "../models/place-model.js";
import User from "../models/user-model.js";
import mongoose from "mongoose";
import fs from "fs";

// get all data places
export const getPlaces = async (req, res, next) => {
  let places;
  try {
    places = await Place.find();
  } catch (error) {
    const err = new HttpError("Something went Wrong, could not find a place ", 500);
    return next(err);
  }
  res.status(200).json(places.map((place) => place.toObject({ getters: true })));
};

// untuk mendapat place berdasarkan placeid
export const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (error) {
    const err = new HttpError("Something went wrong, could not find a place", 500);
    return next(err);
  }
  if (!place) {
    const error = new HttpError("could not find a place for the provide id", 404);
    return next(error);
  }
  res.status(200).json({ place: place.toObject({ getters: true }) });
};

// untuk mendapat place berdasarkan userId
export const getPlaceByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
    // console.log(userWithPlaces);
  } catch (error) {
    const err = new HttpError("Something went wrong, could not find a places", 500);
    return next(err);
  }

  if (!userWithPlaces || userWithPlaces.places.length === 0) {
    return next(new HttpError("could not find a places for the provide Userid", 404));
  }

  res.status(200).json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
};

// Create Place => untuk membuat place Baru
export const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("invalid Inputs passed please check your data.", 422));
    // => tidak menggunkan throw karena async function oleh karena itu menggunkan next
  }
  const { title, description, address, creator } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createPlace = new Place({
    title,
    description,
    location: coordinates,
    image: req.file.path,
    address,
    creator,
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (error) {
    const err = new HttpError("creating place failed, pls try again", 500);
    return next(err);
  }

  if (!user) {
    const err = new HttpError("could not find user for provide id", 404);
    return next(err);
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createPlace.save({ session: sess });
    user.places.push(createPlace);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (error) {
    const err = new HttpError("creating place failed, please try again", 500);
    return next(err);
  }
  res.status(201).json(createPlace);
};

// update Place => untuk memperbarui data
export const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next(new HttpError("invalid Inputs passed please check your data.", 422));
  }
  const { title, description } = req.body;

  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId);
  } catch (error) {
    console.log(error);
    const err = new HttpError("Something went wrong, could not updated place", 500);
    return next(err);
  }

  if (place.creator.toString() !== req.userData.userId) {
    const err = new HttpError("You are not allowed to edit this place", 401);
    return next(err);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (error) {
    const err = new HttpError("Something went wrong, could not update", 500);
    return next(err);
  }

  res.status(200).json(place.toObject({ getters: true }));
};

// deletePlace => untuk menghapus place berdasarkan id
export const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;

  try {
    place = await Place.findById(placeId).populate("creator");
    console.log(place);
  } catch (error) {
    const err = new HttpError("Something went wrong, could not deleted place", 500);
    return next(err);
  }

  if (!place) {
    const err = new HttpError("could not find this place for this Id", 404);
    return next(err);
  }

  if (place.creator._id.toString() !== req.userData.userId) {
    const err = new HttpError("You are not allowed to delete this place", 401);

    return next(err);
  }

  const imagePath = place.image;
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await place.remove({ session: sess });
    place.creator.places.pull(place);
    await place.creator.save({ session: sess });
    sess.commitTransaction();
  } catch (error) {
    const err = new HttpError("Something went wrong, could not deleted place", 500);
    return next(err);
  }
  fs.unlink(imagePath, (err) => {
    console.log(err);
  });
  res.status(200).json(place.toObject({ getters: true }));
};
