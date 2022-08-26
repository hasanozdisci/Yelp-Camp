const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const catchAsync = require("./utils/catchAsync");
const mongoose = require("mongoose");
const Campground = require("./models/camground");
const methodOverride = require("method-override");

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

//HOME PAGE
app.get("/", (req, res) => {
  res.render("home");
});

//ALL CAMPGROUNDS
app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

//NEW CAMPGROUND PAGE
app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

//CREATE NEW CAMPGROUND(POST)
app.post(
  "/campgrounds",
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

//CAMPGROUND DETAILS SHOW PAGE
app.get("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/show", { campground });
}));

//EDİT PAGE
app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  res.render("campgrounds/edit", { campground });
}));

//UPDATE CAMPGROUND
app.put("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
}));

//DELETE CAMPGROUND
app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
}));

//ERROR HANDLER
app.use((err, req, res, next) => {
  res.send("Oh boy, something went wrong!");
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
