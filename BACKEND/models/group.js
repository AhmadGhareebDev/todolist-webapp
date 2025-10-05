const mongoose = require('mongoose');
const stepTaskSchema = require('./StepTask');
const Schema = mongoose.Schema;

const groupSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  stepTasks: [stepTaskSchema],
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = groupSchema;