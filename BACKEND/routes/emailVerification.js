const express = require('express');
const emailVerificationController = require('../controllers/emailVerificationController');
const router = express.Router();

router.route('/:token')
    .get(emailVerificationController.handleEmailVerification);

module.exports = router;