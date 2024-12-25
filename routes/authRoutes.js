// routes/authRoutes.js
const express = require("express");
const passport = require("../middlewares/passport");

const router = express.Router();

// Initiate Google Login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle Google Login Callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect to your desired route
    res.redirect("/");
  }
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
