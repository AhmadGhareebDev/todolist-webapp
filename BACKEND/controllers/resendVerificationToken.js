const { sendVerificationEmail } = require('../services/emailService');
const User = require('../models/User');
const crypto = require('crypto');

const resendVerificationToken = async (req, res) => {
    const { email, username } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            errorCode: "MISSING_FIELDS",
            message: 'email is required.'
        });
    }

    try {
        const foundUser = await User.findOne({ email: email.toLowerCase() }).exec();
        
        if (!foundUser) {
            return res.status(404).json({
                success: false,
                errorCode: "USER_NOT_FOUND",
                message: "The email is incorrect."
            });
        }

        if (foundUser.isEmailVerified) {
            return res.status(200).json({
                success: true,
                message: "Email is already verified.",
                code: 'ALREADY_VERIFIED'
            });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = new Date();
        tokenExpiration.setHours(tokenExpiration.getHours() + 24); 

        foundUser.emailVerificationToken = verificationToken;
        foundUser.emailVerificationExpires = tokenExpiration;
        
        await foundUser.save();

        const emailSent = await sendVerificationEmail(email, username, verificationToken);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                errorCode: "EMAIL_SEND_FAILED",
                message: 'Failed to send verification email. Please try again.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Verification email resent successfully. Please check your inbox.'
        });

    } catch (error) {
        console.error('Resend verification error:', error);
        return res.status(500).json({
            success: false,
            errorCode: "SERVER_ERROR",
            message: 'Failed to resend verification email due to server error.'
        });
    }
};

module.exports = {
    resendVerificationToken
};