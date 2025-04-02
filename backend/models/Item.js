const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  height: { type: Number, required: true },
  mass: { type: Number, required: true },
  priority: { type: Number, min: 1, max: 100 },
  expiryDate: { type: String }, // Changed from Date to String for easier handling
  usageLimit: { type: Number },
  preferredZone: { type: String },
  createdAt: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model('Item', itemSchema);