const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
  {
    questionText: {
      type: String,
      required: true,
    },

    response: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const exitResponseSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    responses: {
      type: [responseSchema],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ExitResponse", exitResponseSchema);