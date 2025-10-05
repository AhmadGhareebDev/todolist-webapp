const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const taskSchema = require("./Task");
const groupSchema = require('./group');
const notificationSchema = require('./notification');

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  tasks: [taskSchema],
  tasksCounter: {
    type: Number,
    default: 0,
  },
  tasksFinishedBeforDeadLine: {
    type: Number,
    default: 0
  },
  overDueTasks: {
    type: Number,
    default: 0
  },
  groups: [groupSchema],
  history: [taskSchema],
  notifications: [notificationSchema],
  refreshToken: String,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

module.exports = mongoose.model("User", userSchema);