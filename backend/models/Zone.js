const mongoose = require("mongoose");
const ZoneSchema = new mongoose.Schema({
  containerId: { type: String, required: true, unique: true },
  zoneName: { type: String, required: true },
  width: { type: Number, required: true },
  depth: { type: Number, required: true },
  height: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Zone", ZoneSchema);