// routes/authRoutes.js
const express = require("express");
const controller = require("../controllers/urlController");
const authMiddleware = require("../middlewares/authenticateToken");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting middleware: Limit to 5 requests per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 2, // Limit each IP to 5 requests per windowMs
  message: "Too many URLs created from this IP, please try again later.",
});

router.post(
  "/shorten",
  authMiddleware.authenticateToken,
  limiter,
  controller.handleShortenUrl
);

module.exports = router;
