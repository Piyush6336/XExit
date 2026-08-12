const User = require("../models/User");
const {
  sendResignationDecisionEmail,
} = require("../services/mailService");

const Resignation = require("../models/Resignation");
const ExitResponse = require("../models/ExitResponse");
const getAllResignations = async (req, res) => {
  try {
    const resignations = await Resignation.find()
      .select("_id employeeId lwd status");

    return res.status(200).json({
      data: resignations,
    });
  } catch (error) {
    console.error("Get resignations error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const concludeResignation = async (req, res) => {
  try {
    const { resignationId, approved, lwd } = req.body;

    if (!resignationId) {
      return res.status(400).json({
        message: "Resignation ID is required",
      });
    }

    if (typeof approved !== "boolean") {
      return res.status(400).json({
        message: "Approved must be a boolean",
      });
    }

    const resignation = await Resignation.findById(resignationId);

    if (!resignation) {
      return res.status(404).json({
        message: "Resignation not found",
      });
    }

    const employee = await User.findById(resignation.employeeId);
    resignation.status = approved ? "approved" : "rejected";

    if (approved && lwd) {
      resignation.exitDate = lwd;
    }

    await resignation.save();
    try {
  await sendResignationDecisionEmail({
    email: employee?.email,
    username: employee?.username,
    approved,
    exitDate: approved ? lwd : null,
  });
} catch (emailError) {
  console.error("Email notification failed:", emailError.message);
}

    return res.status(200).json({
      message: approved
        ? "Resignation approved successfully"
        : "Resignation rejected successfully",
    });
  } catch (error) {
    console.error("Conclude resignation error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllExitResponses = async (req, res) => {
  try {
    const responses = await ExitResponse.find()
      .select("employeeId responses");

    return res.status(200).json({
      data: responses,
    });
  } catch (error) {
    console.error("Get exit responses error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  getAllResignations,
  concludeResignation,
  getAllExitResponses,
};