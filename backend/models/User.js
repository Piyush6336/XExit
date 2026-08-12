const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    default: null,
  },

  role: {
    type: String,
    enum: ["employee", "admin"],
    default: "employee",
  },
});

module.exports = mongoose.model("User", userSchema);