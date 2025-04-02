const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema(
  {
    user: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "placement",
        "rearrangement",
        "disposal",
        "deletion",
      ],
    },
    item: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      default: "Unassigned",
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    details: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
  }
);

// Create text index for searching
LogSchema.index({
  user: "text",
  action: "text",
  item: "text",
  zone: "text",
});

module.exports = mongoose.model("Log", LogSchema);
