const express = require('express');
const router = express.Router();
const userController = require('../../controllers/userController');
const passwordResetController = require('../../controllers/passwordResetController')
const upload = require('../../config/multerConfig');

router.route('/profile-image')
    .post(upload.single('profileImage'), userController.addProfileImage);

router.route('/')
    .delete(userController.deleteAccount)
    .post(userController.addTask)
    .get(userController.getProfileInfo)
   
router.route('/get-tasks') 
    .get(userController.getAllTasks);

router.route('/:id')
    .delete(userController.deleteTask);


router.route('/toggleTask/:taskId')
    .patch(userController.toggleTask);

router.route('/editTask/:taskId')
    .patch(userController.editTask)

router.route('/editProfile')
    .patch(userController.editProfile)
router.route('/get-history-tasks')
    .get(userController.getHistoryTasks);

router.route('/groups')
    .post(userController.addTasksGroup)
    .get(userController.getGroups)

router.route('/groups/:groupId')
    .delete(userController.deleteGroup)
    .get(userController.getGroupTasks)
router.route('/groups/:groupId/tasks/:taskId')
    .delete(userController.deleteStepTask)
router.route('/groups/:groupId/tasks')
    .post(userController.addTaskToGroup)

router.route('/groups/:groupId/tasks/:taskId/toggle')
    .patch(userController.toggleStepTask)

// statistics :: 

router.route('/get-tasks-number')
    .get(userController.getTasksNumber)



// notifications
router.route('/notifications')
    .get(userController.getNotifications)
router.route('/mark-notification-read/:id')
    .patch(userController.markNotificationRead)
module.exports = router;



