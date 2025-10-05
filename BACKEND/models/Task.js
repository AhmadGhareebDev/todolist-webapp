const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
  title: { type: String, required: true },
  desc: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  deadLine: { type: Date },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Low"
  }
});

module.exports = taskSchema;