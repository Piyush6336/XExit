const Resignation = require("../models/Resignation");
const { isHoliday } = require("../services/calendarificService");
const { isWeekend } = require("../services/dateValidation");

const submitResignation = async (req, res) => {
  try {
    const { lwd } = req.body;

    if (!lwd) {
      return res.status(400).json({
        message: "Last working day is required",
      });
    }

    // Check date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    if (!dateRegex.test(lwd)) {
      return res.status(400).json({
        message: "LWD must be in YYYY-MM-DD format",
      });
    }

    // Check whether the date is a real calendar date
    const date = new Date(`${lwd}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({
        message: "Invalid last working day",
      });
    }

    // Check weekend
    if (isWeekend(lwd)) {
      return res.status(400).json({
        message: "Last working day cannot be on a weekend",
      });
    }

    // Check holiday
    const holiday = await isHoliday(lwd);

    if (holiday) {
      return res.status(400).json({
        message: "Last working day cannot be a holiday",
      });
    }

    // Check existing resignation
    const existingResignation = await Resignation.findOne({
      employeeId: req.user.userId,
      status: {
        $in: ["pending", "approved"],
      },
    });

    if (existingResignation) {
      return res.status(409).json({
        message: "Employee already has an active resignation",
      });
    }

    const resignation = await Resignation.create({
      employeeId: req.user.userId,
      lwd,
      status: "pending",
    });

    return res.status(200).json({
      data: {
        resignation: {
          _id: resignation._id,
        },
      },
    });
  } catch (error) {
    console.error("Resignation submission error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
const ExitResponse = require("../models/ExitResponse");

const submitExitResponses = async (req, res) => {
  try {
    const { responses } = req.body;

    if (!Array.isArray(responses) || responses.length === 0) {
      return res.status(400).json({
        message: "Responses are required",
      });
    }

    for (const item of responses) {
      if (!item.questionText || !item.response) {
        return res.status(400).json({
          message: "Each response must contain questionText and response",
        });
      }
    }

    const approvedResignation = await Resignation.findOne({
      employeeId: req.user.userId,
      status: "approved",
    });

    if (!approvedResignation) {
      return res.status(403).json({
        message: "Exit questionnaire is available only after resignation approval",
      });
    }

    const existingResponse = await ExitResponse.findOne({
      employeeId: req.user.userId,
    });

    if (existingResponse) {
      return res.status(409).json({
        message: "Exit questionnaire has already been submitted",
      });
    }

    const exitResponse = await ExitResponse.create({
      employeeId: req.user.userId,
      responses,
    });

    return res.status(200).json({
      message: "Exit questionnaire submitted successfully",
      data: {
        _id: exitResponse._id,
      },
    });
  } catch (error) {
    console.error("Exit questionnaire error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
const getMyResignation = async (req, res) => {
  try {
    const resignation = await Resignation.findOne({
      employeeId: req.user.userId,
    }).sort({ createdAt: -1 });

    if (!resignation) {
      return res.status(404).json({
        message: "No resignation request found",
      });
    }

    return res.status(200).json({
      data: {
        resignation,
      },
    });
  } catch (error) {
    console.error("Get resignation error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};
module.exports = {
  submitResignation,
  submitExitResponses,
  getMyResignation,
};