const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  message: { type: String, required: true },
  severity: { type: String, enum: ["error", "warning"], required: true },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = notificationSchema;