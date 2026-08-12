const express = require("express");

const router = express.Router();

const {
  submitResignation,
  submitExitResponses,
  getMyResignation,
} = require("../controllers/userController");

const {
  authenticate,
  requireEmployee,
} = require("../middleware/authMiddleware");

router.post(
  "/resign",
  authenticate,
  requireEmployee,
  submitResignation
);

router.get(
  "/resignation-status",
  authenticate,
  requireEmployee,
  getMyResignation
);

router.post(
  "/responses",
  authenticate,
  requireEmployee,
  submitExitResponses
);

module.exports = router;