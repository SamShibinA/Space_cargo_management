const mongoose = require("mongoose");

const ZoneSchema = new mongoose.Schema({
  containerId: String,
  zoneName: String,
  width: Number,
  depth: Number,
  height: Number,
});

module.exports = mongoose.model("Zone", ZoneSchema);
