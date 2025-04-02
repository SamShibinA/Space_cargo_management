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


// Add these new routes at the bottom, before module.exports
const isExpired = (expiryDate) => {
  if (!expiryDate) return false;
  
  const [year, month, day] = expiryDate.split('/');
  const expiry = new Date(year, month - 1, day); // month is 0-indexed
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return expiry < today;
};

// Get expired items
router.get('/waste', async (req, res) => {
  try {
    const items = await Item.find({});
    
    // Always return an array, even if empty
    const wasteItems = items.filter(item => isExpired(item.expiryDate))
      .map(item => ({
        id: item._id.toString(),
        itemId: item.itemId,
        containerId: item.preferredZone || 'Unassigned',
        itemname: item.name,
        ExpDate: item.expiryDate,
        reason: 'Expired'
      }));

    // Ensure we always return an array
    res.status(200).json(Array.isArray(wasteItems) ? wasteItems : []);
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json([]); // Return empty array on error
  }
});

// Delete endpoint remains the same
router.delete('/waste/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Delete failed' });
  }
});


router.post("/", async (req, res) => {
  try {
    const newItem = new Item(req.body);
    await newItem.save();

    // Create a log entry
    const logEntry = new Log({
      user: req.user?.id || "system", // Assuming you have user auth
      action: "creation",
      item: newItem.itemId,
      zone: newItem.preferredZone || "Unassigned",
      details: {
        name: newItem.name,
        dimensions: {
          width: newItem.width,
          depth: newItem.depth,
          height: newItem.height,
        },
      },
    });
    await logEntry.save();

    res.status(201).json(newItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
