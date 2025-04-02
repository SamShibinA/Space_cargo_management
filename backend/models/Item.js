// const mongoose = require("mongoose");

// const ItemSchema = new mongoose.Schema({
//   itemId: String,
//   name: String,
//   width: Number,
//   depth: Number,
//   height: Number,
//   mass: Number,
//   priority: Number,
//   expiryDate: String,
//   usageLimit: Number,
//   preferredZone: String,
// });

// module.exports = mongoose.model("Item", ItemSchema);




const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  height: { type: Number, required: true },
  mass: { type: Number, required: true },
  priority: { type: Number, min: 1, max: 100 },
  expiryDate: { type: Date },
  usageLimit: { type: Number },
  preferredZone: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);