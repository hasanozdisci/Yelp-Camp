const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const methodOverride = require("method-override");

//ROUTES
const campgrounds = require("./routes/campgrounds");
const review = require("./routes/reviews");

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

// EJS-MATE CONFIG
app.engine("ejs", ejsMate);
// EJS CONFG
app.set("view engine", "ejs");
// PATH VIEWS
app.set("views", path.join(__dirname, "views"));
// BODY PARSER
app.use(express.urlencoded({ extended: true }));
// FOR PUT AND DELETE METHODS(METHOD OVERRİDE)
app.use(methodOverride("_method"));
// FOR STATIC ASSEST
app.use(express.static(path.join(__dirname, "public")));

//ROUTES MIDDLEWARE
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", review);

// HOME PAGE
app.get("/", (req, res) => {
  res.render("home");
});

// THIS WILL ONLY RUN IF NOTHING ELSE MATCHED FIRST, WE DIDN'T RESPOND ANY OF THEM
// PAGE NOT FOUND
app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.massage = "Oh No, Something Went Wrong";
  // IF WE GOT A ERROR THEN RENDER "ERROR PAGE"
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("Serving on port 3000");
});
