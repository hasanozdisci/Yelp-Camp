const express = require("express");
const router = express.Router();
const users = require("../controllers/users");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");

//! REGISTER
router.get("/register", users.renderRegister);

router.post("/register", catchAsync(users.register));

//! LOGIN
router.get("/login", users.renderLogin);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.login
);

//! LOGOUT
router.get("/logout", users.logout);

module.exports = router;

// router.get("/logout", (req, res, next) => {
//   req.logout((err) => {
//     if (err) return next(err);
//     req.flash("success", "Goodbye!");
//     res.redirect("/campgrounds");
//   });
// });
