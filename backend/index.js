require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const zoneRoutes = require("./routes/zoneRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Routes
app.use("/api/zones", zoneRoutes);
app.use("/api/items", itemRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
