const express = require('express');
const resendVerificationController = require('../controllers/resendVerificationToken');
const router = express.Router();

router.route('/')
    .post(resendVerificationController.resendVerificationToken);

module.exports = router;