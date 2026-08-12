const User = require("../models/User");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin account already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin", 10);

    await User.create({
      username: "admin",
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin account created successfully");
  } catch (error) {
    console.error("Admin seeding error:", error.message);
  }
};

module.exports = seedAdmin;