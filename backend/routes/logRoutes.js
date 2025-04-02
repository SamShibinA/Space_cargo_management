const express = require("express");
const Log = require("../models/Log");
const router = express.Router();

// Create a new log entry
router.post("/", async (req, res) => {
  try {
    const log = new Log(req.body);
    await log.save();
    res.status(201).json(log);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all logs with optional filtering
router.get("/", async (req, res) => {
  try {
    const { user, action, item, zone, startDate, endDate, search } = req.query;

    const filter = {};

    if (user) filter.user = user;
    if (action) filter.action = action;
    if (item) filter.item = item;
    if (zone) filter.zone = zone;

    if (startDate || endDate) {
      filter.timestamp = {};
      if (startDate) filter.timestamp.$gte = new Date(startDate);
      if (endDate) filter.timestamp.$lte = new Date(endDate);
    }

    if (search) {
      filter.$text = { $search: search };
    }

    const logs = await Log.find(filter)
      .sort({ timestamp: -1 }) // Newest first
      .limit(1000); // Limit to prevent overloading

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific log by ID
router.get("/:id", async (req, res) => {
  try {
    const log = await Log.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.json(log);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a log
router.delete("/:id", async (req, res) => {
  try {
    const log = await Log.findByIdAndDelete(req.params.id);
    if (!log) {
      return res.status(404).json({ error: "Log not found" });
    }
    res.json({ message: "Log deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
