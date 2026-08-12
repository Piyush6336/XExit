require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const seedAdmin = require("./config/seedAdmin");

const app = express();

const PORT = process.env.PORT || 3001;
app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "ExitEase backend is running",
  });
});

const startServer = async () => {
  try {
    await connectDB();

    await seedAdmin();

    app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
  } catch (error) {
    console.error("Failed to start server:", error.message);
  }
};

startServer();