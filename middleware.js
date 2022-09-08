const { campgroundSchema, reviewSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

// PASSPORTJS IS LOGGED IN
module.exports.isLoggedIn = (req, res, next) => {
  //req.isAuthenticated() will return true if user is logged in
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    // yeni campground eklemek için giriş yapmamız gerekli. Giriş yaptıktan sonra bizi tekrar yeni campground sayfasına yönlendir.
    // console.log(req.session.returnTo);
    // /campgrounds/new
    req.flash("error", "You must be signed in first!");
    return res.redirect("/login");
  }
  next();
};

//SERVER SIDE ERRORS FOR CAMPGROUNDS WITH JOI
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
// CONTROL TO AUTHOR
module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//SERVER SIDE ERRORS FOR REVIEWS WITH JOI
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// CONTROL TO REVIEW AUTHOR
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
