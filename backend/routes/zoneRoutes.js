const express = require("express");
const Zone = require("../models/Zone");
const upload = require("../middlewares/upload");
const csv = require("csv-parser");
const fs = require("fs");

const router = express.Router();

// Add new zone (Manual Entry)
router.post("/", async (req, res) => {
  try {
    const newZone = new Zone(req.body);
    await newZone.save();
    res.status(201).json({ message: "Zone added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add zone" });
  }
});

// Get all zones
router.get("/", async (req, res) => {
  try {
    const zones = await Zone.find();
    res.status(200).json(zones);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch zones" });
  }
});

// Upload zones via CSV
router.post("/upload", upload.single("file"), async (req, res) => {
  const zones = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => zones.push(row))
    .on("end", async () => {
      try {
        await Zone.insertMany(zones);
        res.status(201).json({ message: "Zones uploaded successfully" });
      } catch (error) {
        res.status(500).json({ error: "CSV upload failed" });
      }
    });
});

module.exports = router;
