const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  itemId: String,
  name: String,
  width: Number,
  depth: Number,
  height: Number,
  mass: Number,
  priority: Number,
  expiryDate: String,
  usageLimit: Number,
  preferredZone: String,
});

module.exports = mongoose.model("Item", ItemSchema);




