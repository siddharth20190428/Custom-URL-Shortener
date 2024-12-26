// routes/analyticsRoutes.js
const express = require("express");
const controller = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authenticateToken");

const router = express.Router();

router.get(
  "/overall",
  authMiddleware.authenticateToken,
  controller.getOverallAnalytics
);
router.get("/topic/:topic", controller.getAnalyticsByTopic);
router.get(
  "/:alias",
  authMiddleware.authenticateToken,
  controller.handleSingleAnalytics
);

module.exports = router;
