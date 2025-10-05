const express = require('express');
const router = express.Router();
const passwordResetController = require('../../controllers/passwordResetController.js')



router.route('/forgot-password')
    .post(passwordResetController.requestPasswordReset)
router.route('/verify-reset-token/:token')
    .get(passwordResetController.verifyResetToken)

router.route('/reset-password/:token')
    .post( passwordResetController.resetPassword)



module.exports = router;
