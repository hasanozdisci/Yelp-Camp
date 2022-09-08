const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
const Campground = require("../models/campground");

//ALL CAMPGROUNDS
router.get("/", catchAsync(campgrounds.index));

//NEW CAMPGROUND PAGE
router.get("/new", isLoggedIn, campgrounds.renderNewForm);

//CREATE NEW CAMPGROUND(POST)
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);

//CAMPGROUND DETAILS SHOW PAGE
router.get("/:id", catchAsync(campgrounds.showCampground));

//EDİT PAGE
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

//UPDATE CAMPGROUND
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);

//DELETE CAMPGROUND
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

module.exports = router;
