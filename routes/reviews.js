const express = require("express");
//mergeParams girmessek req.params null döner
const router = express.Router({ mergeParams: true });
const { reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/review");
const reviews = require("../controllers/reviews");
const Campground = require("../models/campground");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

//! CAMPGROUND REVIEWS
router.post("/", validateReview, isLoggedIn, catchAsync(reviews.createReview));

// DELETING REVIEWS
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

module.exports = router;
