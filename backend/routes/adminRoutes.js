const express = require("express");

const {
  getAllResignations,
  concludeResignation,
  getAllExitResponses,
} = require("../controllers/adminController");

const {
  authenticate,
  requireAdmin,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/resignations",
  authenticate,
  requireAdmin,
  getAllResignations
);
router.put(
  "/conclude_resignation",
  authenticate,
  requireAdmin,
  concludeResignation
);
router.get(
  "/exit_responses",
  authenticate,
  requireAdmin,
  getAllExitResponses
);


module.exports = router;