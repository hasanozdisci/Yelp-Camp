const express = require("express");
//mergeParams girmessek req.params null döner
const router = express.Router({ mergeParams: true });

const { reviewSchema } = require("../schemas.js");

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Review = require("../models/review");
const Campground = require("../models/camground");

//SERVER SIDE ERRORS FOR REVIEWS WITH JOI
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

//! CAMPGROUND REVIEWS
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    // console.log(req.body)
    // console.log(req.body.review)
    // console.log(review)
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

// DELETING REVIEWS
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    // console.log(id)
    // console.log(reviewId)
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/campgrounds/${id}`);
  })
);

module.exports = router;
