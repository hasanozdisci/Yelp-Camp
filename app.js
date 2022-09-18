if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const { MongoStore } = require("connect-mongo");
const MongoDBStore = require("connect-mongo")(session);

//ROUTES
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/users");

//! MONGO ATLAS CONNECTION
const dbUrl = process.env.DB_URL || "mongodb://127.0.0.1:27017/yelp-camp";


mongoose
  .connect(dbUrl)
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
// MONGO SQL INJECTION
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

// SESSION STORE
const store = new MongoDBStore({
  url: dbUrl,
  secret: secret,
  touchAfter: 24 * 60 * 60,
});

store.on("error", function(e) {
  console.log("SESSION STORE ERROR", e)
})

// SESSION CONFIG
const sessionConfig = {
  store: store,
  name: "session",
  secret: secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};

app.use(session(sessionConfig));
// SESSION FLASH
app.use(flash());

// HELMET
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
];
const connectSrcUrls = [
  "https://api.mapbox.com/",
  "https://a.tiles.mapbox.com/",
  "https://b.tiles.mapbox.com/",
  "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        "https://res.cloudinary.com/dzybcr4gg/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        "https://images.unsplash.com/",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);



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
