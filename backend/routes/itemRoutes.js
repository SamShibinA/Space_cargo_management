const express = require("express");
const Item = require("../models/Item");
const upload = require("../middlewares/upload");
const csv = require("csv-parser");
const fs = require("fs");

const router = express.Router();

// Add new item (Manual Entry)
router.post("/", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();
    res.status(201).json({ message: "Item added successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to add item" });
  }
});

// Get all items
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

// Upload items via CSV
router.post("/upload", upload.single("file"), async (req, res) => {
  const items = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on("data", (row) => items.push(row))
    .on("end", async () => {
      try {
        await Item.insertMany(items);
        res.status(201).json({ message: "Items uploaded successfully" });
      } catch (error) {
        res.status(500).json({ error: "CSV upload failed" });
      }
    });
});

module.exports = router;
