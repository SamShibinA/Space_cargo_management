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




const isExpired = (expiryDate) => {
  if (!expiryDate || expiryDate === "N/A") return false;
  
  try {
    const [day, month, year] = expiryDate.split('/');
    const expiry = new Date(`${year}-${month}-${day}`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return expiry < today;
  } catch (error) {
    console.error('Error parsing date:', error);
    return false;
  }
};

// Get all expired items
router.get('/waste', async (req, res) => {
  try {
    const items = await Item.find({});
    const wasteItems = items
      .filter(item => isExpired(item.expiryDate))
      .map(item => ({
        id: item._id,
        itemId: item.itemId,
        name: item.name,
        expiryDate: item.expiryDate,
        preferredZone: item.preferredZone || 'Unassigned'
      }));

    res.status(200).json(wasteItems);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch expired items' });
  }
});

// Delete expired item
router.delete('/waste/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to delete item' });
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
