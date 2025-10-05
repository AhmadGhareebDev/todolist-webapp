const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const cron = require("node-cron");

const deleteAccount = async (req, res) => {
  const { email } = req;

  if (!email)
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });

  try {
    const deletedUser = await User.findOneAndDelete({ email }).exec();
    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    if (req.cookies?.jwt) {
      res.clearCookie("jwt", {
        httpOnly: true,
        secure: true,
        sameSite: "None",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const addTask = async (req, res) => {
  const { desc, deadLine, title, priority } = req.body;
  const { email } = req;

  if (!desc)
    return res.status(400).json({
      success: false,
      message: "The Task Description is required.",
      errorCode: "MISSING_DESC",
    });

  if (!title)
    return res.status(400).json({
      success: false,
      message: "The Task Title is required.",
      errorCode: "MISSING_TITLE",
    });

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser)
      return res
        .status(404)
        .json({
          success: false,
          message: "User not found",
          errorCode: "USER_NOT_FOUND",
        });

    const newTask = {
      title: title,
      desc: desc,
      deadLine: deadLine ? new Date(deadLine) : null,
      priority: priority || "Low",
    };

    foundUser.tasks.push(newTask);
    foundUser.tasksCounter += 1;
    await foundUser.save();

    const createdTask = foundUser.tasks[foundUser.tasks.length - 1];

    res.status(201).json({
      success: true,
      data: createdTask,
      message: "Task created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const getTasksNumber = async (req, res) => {
  const email = req.email;
  if (!email)
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser)
    return res
      .status(403)
      .json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });

  const now = Date.now();
  const overDueTasks = foundUser.tasks.reduce((count, task) => {
    if (
      !task.completed &&
      task.deadLine &&
      new Date(task.deadLine).getTime() < now
    ) {
      return count + 1;
    }
    return count;
  }, 0);

  return res.status(200).json({
    success: true,
    message: "Task statistics retrieved",
    data: {
      tasksCounter: foundUser.tasksCounter,
      tasksFinishedBeforDeadLine: foundUser.tasksFinishedBeforDeadLine,
      overDueTasks,
    },
  });
};

const deleteTask = async (req, res) => {
  const id = req.params.id;
  if (!id)
    return res
      .status(400)
      .json({
        success: false,
        message: "Task ID required",
        errorCode: "MISSING_ID",
      });

  const email = req.email;
  if (!email)
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser)
    return res
      .status(403)
      .json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });

  try {
    const taskInTasks = foundUser.tasks.id(id);
    if (taskInTasks) {
      foundUser.tasks.pull(id);
      await foundUser.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Task deleted successfully",
          data: {},
        });
    }

    const taskInHistory = foundUser.history.id(id);
    if (taskInHistory) {
      foundUser.history.pull(id);
      await foundUser.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Task deleted successfully",
          data: {},
        });
    }

    return res.status(404).json({
      success: false,
      message: "Task not found in tasks or history",
      errorCode: "TASK_NOT_FOUND",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const getAllTasks = async (req, res) => {
  const email = req.email;
  if (!email)
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser)
    return res
      .status(403)
      .json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });

  return res.status(200).json({
    success: true,
    message: "Tasks retrieved successfully",
    data: foundUser.tasks,
  });
};

const getHistoryTasks = async (req, res) => {
  const email = req.email;
  if (!email)
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser)
    return res
      .status(403)
      .json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });

  return res.status(200).json({
    success: true,
    message: "History tasks retrieved successfully",
    data: foundUser.history,
  });
};

const toggleTask = async (req, res) => {
  const { taskId } = req.params;
  const { email } = req;

  if (!email) {
    return res
      .status(403)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User not found",
          errorCode: "USER_NOT_FOUND",
        });
    }

    const task = user.tasks.id(taskId);
    if (!task) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Task not found",
          errorCode: "TASK_NOT_FOUND",
        });
    }

    let taskDeadLine = new Date(task.deadLine);
    let now = Date.now();

    if (taskDeadLine.getTime() > now || !taskDeadLine.getTime()) {
      user.tasksFinishedBeforDeadLine += 1;
    }
    if (task.completed === true)
      return res
        .status(400)
        .json({
          success: false,
          message: "Task already completed",
          errorCode: "TASK_ALREADY_COMPLETED",
        });

    task.completed = true;
    if (task.completed) {
      user.history.push(task);
    }
    await user.save();

    return res
      .status(200)
      .json({
        success: true,
        message: "Task toggled successfully",
        data: task,
      });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        errorCode: "SERVER_ERROR",
      });
  }
};

const editTask = async (req, res) => {
  const allowedPriorities = ["High", "Medium", "Low"];
  const { email } = req;
  const { title, desc, priority, deadLine } = req.body;
  const { taskId } = req.params;

  if (!email) {
    return res
      .status(403)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({
          success: false,
          message: "User not found",
          errorCode: "USER_NOT_FOUND",
        });
    }

    const task = user.tasks.id(taskId);
    if (!task) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Task not found",
          errorCode: "TASK_NOT_FOUND",
        });
    }

    if (desc) task.desc = desc;
    if (title) task.title = title;
    if (priority) {
      if (allowedPriorities.indexOf(priority) === -1) {
        return res.status(400).json({
          success: false,
          message: "Invalid priority for the task",
          errorCode: "INVALID_PRIORITY",
        });
      } else {
        task.priority = priority;
      }
    }

    if (deadLine !== undefined) {
      if (deadLine === null || deadLine === "") {
        task.deadLine = null;
      } else {
        task.deadLine = new Date(deadLine);
      }
    }

    await user.save();
    const editedTask = user.tasks.id(taskId);

    return res.status(200).json({
      success: true,
      message: "Task edited successfully",
      data: editedTask,
    });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Internal server error",
        errorCode: "SERVER_ERROR",
      });
  }
};

const editProfile = async (req, res) => {
  const { username, currentPassword, newPassword } = req.body;
  const { email } = req;

  if (!username && (!currentPassword || !newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "Provide a new username or both current and new passwords to update your profile",
      errorCode: "MISSING_FIELDS",
    });
  }

  if ((currentPassword && !newPassword) || (!currentPassword && newPassword)) {
    return res.status(400).json({
      success: false,
      message:
        "To change your password, both current and new passwords are required",
      errorCode: "INCOMPLETE_PASSWORD_UPDATE",
    });
  }

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
      errorCode: "UNAUTHORIZED",
    });
  }

  let update = false;

  try {
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(403).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    if (username) {
      foundUser.username = username.trim();
      update = true;
    }

    if (newPassword) {
      const correctPassword = await bcrypt.compare(
        currentPassword,
        foundUser.password
      );
      if (!correctPassword) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
          errorCode: "INVALID_PASSWORD",
        });
      } else {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        foundUser.password = hashedPassword;
        update = true;
      }
    }

    if (update) {
      await foundUser.save();
    }

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {},
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const addProfileImage = async (req, res) => {
  const { email } = req;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image file",
      errorCode: "NO_FILE_UPLOADED",
    });
  }

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    if (foundUser.profileImage) {
      const oldImagePath = path.join(
        __dirname,
        "..",
        "storage",
        "profileImages",
        path.basename(foundUser.profileImage)
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/profileImages/${
      req.file.filename
    }`;
    foundUser.profileImage = imageUrl;
    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: {
        profileImage: imageUrl,
      },
    });
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const getProfileInfo = async (req, res) => {
  const { email } = req;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  const foundUser = await User.findOne({ email: email }).exec();

  if (!foundUser) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      errorCode: "USER_NOT_FOUND",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Profile info retrieved successfully",
    data: foundUser,
  });
};

const addTasksGroup = async (req, res) => {
  const { email } = req;
  const { title } = req.body;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
      errorCode: "MISSING_TITLE",
    });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    foundUser.groups.push({
      title: title,
      stepTasks: [],
      completed: false,
    });

    await foundUser.save();

    return res.status(201).json({
      success: true,
      message: "New group added successfully",
      data: foundUser.groups,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const addTaskToGroup = async (req, res) => {
  const { email } = req;
  const { groupId } = req.params;
  const { title } = req.body;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Title is required",
      errorCode: "MISSING_TITLE",
    });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const foundGroup = foundUser.groups.id(groupId);

    if (!foundGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
        errorCode: "GROUP_NOT_FOUND",
      });
    }

    const newOrder = foundGroup.stepTasks.length + 1;

    foundGroup.stepTasks.push({
      title: title,
      completed: false,
      order: newOrder,
    });

    await foundUser.save();

    return res.status(201).json({
      success: true,
      message: "Step task added successfully",
      data: foundGroup.stepTasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const deleteGroup = async (req, res) => {
  const { email } = req;
  const { groupId } = req.params;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const foundGroup = foundUser.groups.id(groupId);

    if (!foundGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
        errorCode: "GROUP_NOT_FOUND",
      });
    }

    foundUser.groups.pull(groupId);

    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Group deleted successfully",
      data: foundUser.groups,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const deleteStepTask = async (req, res) => {
  const { email } = req;
  const { groupId, taskId } = req.params;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const foundGroup = foundUser.groups.id(groupId);

    if (!foundGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
        errorCode: "GROUP_NOT_FOUND",
      });
    }

    const taskToDelete = foundGroup.stepTasks.id(taskId);

    if (!taskToDelete) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        errorCode: "TASK_NOT_FOUND",
      });
    }

    const deletedTaskOrder = taskToDelete.order;

    foundGroup.stepTasks.pull(taskId);

    foundGroup.stepTasks.forEach((task) => {
      if (task.order > deletedTaskOrder) {
        task.order = task.order - 1;
      }
    });

    const allTasksCompleted = foundGroup.stepTasks.every(
      (task) => task.completed
    );
    foundGroup.completed = allTasksCompleted;

    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Step task deleted successfully",
      data: foundGroup.stepTasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const toggleStepTask = async (req, res) => {
  const { email } = req;
  const { groupId, taskId } = req.params;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const foundGroup = foundUser.groups.id(groupId);

    if (!foundGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
        errorCode: "GROUP_NOT_FOUND",
      });
    }

    const foundTask = foundGroup.stepTasks.id(taskId);

    if (!foundTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
        errorCode: "TASK_NOT_FOUND",
      });
    }

    const currentOrder = foundTask.order;
    const previousTasks = foundGroup.stepTasks.filter(
      (task) => task.order < currentOrder
    );
    const allPreviousCompleted = previousTasks.every((task) => task.completed);

    if (!allPreviousCompleted && !foundTask.completed) {
      return res.status(400).json({
        success: false,
        message: "Complete previous tasks first",
        errorCode: "PREVIOUS_TASKS_INCOMPLETE",
      });
    }

    foundTask.completed = !foundTask.completed;

    const allTasksCompleted = foundGroup.stepTasks.every(
      (task) => task.completed
    );
    foundGroup.completed = allTasksCompleted;
    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Step task updated successfully",
      data: foundGroup,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const getGroups = async (req, res) => {
  const { email } = req;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Groups retrieved successfully",
      data: foundUser.groups,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const getGroupTasks = async (req, res) => {
  const { email } = req;
  const { groupId } = req.params;

  if (!email) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized",
      errorCode: "UNAUTHORIZED",
    });
  }

  try {
    const foundUser = await User.findOne({ email: email }).exec();

    if (!foundUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        errorCode: "USER_NOT_FOUND",
      });
    }

    const foundGroup = foundUser.groups.id(groupId);

    if (!foundGroup) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
        errorCode: "GROUP_NOT_FOUND",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Group tasks retrieved successfully",
      data: foundGroup.stepTasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const generateNotifications = async () => {
  try {
    const users = await User.find({}).exec();
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;

    for (const user of users) {
      let updated = false;
      for (const task of user.tasks) {
        if (task.completed || !task.deadLine) continue;

        const deadline = new Date(task.deadLine).getTime();
        const existingNotification = user.notifications.find(
          (n) =>
            n.taskId.equals(task._id) &&
            n.severity === (deadline < now ? "error" : "warning")
        );
        if (deadline < now && !existingNotification) {
          user.notifications.push({
            taskId: task._id,
            message: `Task "${task.title}" is overdue!`,
            severity: "error",
            read: false,
          });
          updated = true;
        } else if (
          deadline > now &&
          deadline <= now + oneHour &&
          !existingNotification
        ) {
          user.notifications.push({
            taskId: task._id,
            message: `Task "${task.title}" is due in 1 hour!`,
            severity: "warning",
            read: false,
          });
          updated = true;
        }
      }

      if (user.notifications.length > 20) {
        user.notifications = user.notifications.slice(-20);
        updated = true;
      }

      if (updated) await user.save();
    }
  } catch (error) {
    console.error("Cron job error:", error.message);
  }
};
cron.schedule("*/5 * * * *", generateNotifications);

const getNotifications = async (req, res) => {
  const { email } = req;
  if (!email)
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });

  try {
    const foundUser = await User.findOne({ email })
      .select("notifications")
      .exec();
    if (!foundUser)
      return res
        .status(404)
        .json({
          success: false,
          message: "User not found",
          errorCode: "USER_NOT_FOUND",
        });

    return res.status(200).json({
      success: true,
      message: "Notifications retrieved successfully",
      data: foundUser.notifications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

const markNotificationRead = async (req, res) => {
  const { email } = req;
  const { id } = req.params;
  if (!email)
    return res
      .status(401)
      .json({
        success: false,
        message: "Unauthorized",
        errorCode: "UNAUTHORIZED",
      });
  if (!id)
    return res
      .status(400)
      .json({
        success: false,
        message: "Notification ID required",
        errorCode: "MISSING_ID",
      });

  try {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser)
      return res
        .status(404)
        .json({
          success: false,
          message: "User not found",
          errorCode: "USER_NOT_FOUND",
        });

    const notification = foundUser.notifications.id(id);
    if (!notification)
      return res.status(404).json({
        success: false,
        message: "Notification not found",
        errorCode: "NOTIFICATION_NOT_FOUND",
      });

    notification.read = true;
    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      errorCode: "SERVER_ERROR",
    });
  }
};

module.exports = {
  deleteAccount,
  addTask,
  deleteTask,
  getAllTasks,
  toggleTask,
  editTask,
  editProfile,
  getProfileInfo,
  addProfileImage,
  getHistoryTasks,
  getTasksNumber,
  addTasksGroup,
  toggleStepTask,
  addTaskToGroup,
  deleteGroup,
  deleteStepTask,
  getGroups,
  getGroupTasks,
  generateNotifications,
  getNotifications,
  markNotificationRead
};