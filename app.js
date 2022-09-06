const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

//ROUTES
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

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
// SESSION CONFIG
const sessionConfig = {
  secret: "thisshouldbeabettersecret!",
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
// SESSION FLASH
app.use(flash());

// PASSPORT MIDDLEWARE
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// MIDDLEWARE which we can access everywhere
app.use((req, res, next) => {
  console.log(req.session)
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// FAKE USER WITH PASSPORT
// app.get("/fakeUser", async (req, res) => {
//   const user = new User({ email: "hasanbasan@gmail.com", username: "hasan" });
//   const newUser = await User.register(user, "chicken");
//   res.send(newUser);
// });

//ROUTES MIDDLEWARE
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

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
