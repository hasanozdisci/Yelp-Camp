const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const Joi = require("joi");
const { campgroundSchema, reviewSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const Campground = require("./models/camground");
const methodOverride = require("method-override");
const Review = require("./models/review");

//connection and error handling
mongoose
  .connect("mongodb://127.0.0.1:27017/yelp-camp")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("connection error:");
    console.log(err);
  });

//EJS-MATE CONFIG
app.engine("ejs", ejsMate);
//EJS CONFG
app.set("view engine", "ejs");
//PATH VIEWS
app.set("views", path.join(__dirname, "views"));
//BODY PARSER
app.use(express.urlencoded({ extended: true }));
//FOR PUT AND DELETE METHODS(METHOD OVERRİDE)
app.use(methodOverride("_method"));

//SERVER SIDE ERRORS FOR CAMPGROUNDS WITH JOI
const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

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

//HOME PAGE
app.get("/", (req, res) => {
  res.render("home");
});

//ALL CAMPGROUNDS
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);

//NEW CAMPGROUND PAGE
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//CREATE NEW CAMPGROUND(POST)
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    // if (!req.body.campground)
    //   throw new ExpressError("Invalid Campground Data", 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//CAMPGROUND DETAILS SHOW PAGE
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    // console.log(campground)
    res.render("campgrounds/show", { campground });
  })
);

//EDİT PAGE
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
  })
);

//UPDATE CAMPGROUND
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//DELETE CAMPGROUND
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

// CAMPGROUND REVIEWS
app.post(
  "/campgrounds/:id/reviews", validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//THIS WILL ONLY RUN IF NOTHING ELSE MATCHED FIRST, WE DIDN'T RESPOND ANY OF THEM
//PAGE NOT FOUND
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

//ERROR HANDLER
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.massage = "Oh No, Something Went Wrong";
  //IF WE GOT A ERROR THEN RENDER "ERROR PAGE"
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
