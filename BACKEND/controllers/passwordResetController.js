const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../services/emailService');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({
            success: false,
            errorCode: 'MISSING_FIELDS',
            message: 'Email is required'
        });
    }

    try {
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(200).json({
                success: true,
                message: 'If an account exists with this email, a password reset link will be sent.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpires = Date.now() + 3600000; // 1 hour

        user.passwordResetToken = resetToken;
        user.passwordResetExpires = resetTokenExpires;
        await user.save();

        // Send reset email
        const emailSent = await sendPasswordResetEmail(email, user.username, resetToken);

        if (!emailSent) {
            return res.status(500).json({
                success: false,
                errorCode: 'EMAIL_SEND_FAILED',
                message: 'Failed to send reset email. Please try again.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'If an account exists with this email, a password reset link will be sent.'
        });

    } catch (error) {
        console.error('Password reset request error:', error);
        return res.status(500).json({
            success: false,
            errorCode: 'SERVER_ERROR',
            message: 'Something went wrong. Please try again.'
        });
    }
};

const verifyResetToken = async (req, res) => {
    const { token } = req.params;

    if (!token) {
        return res.status(400).json({
            success: false,
            errorCode: 'MISSING_TOKEN',
            message: 'Reset token is required'
        });
    }

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                errorCode: 'INVALID_TOKEN',
                message: 'Invalid or expired reset token'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Token is valid'
        });

    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(500).json({
            success: false,
            errorCode: 'SERVER_ERROR',
            message: 'Something went wrong'
        });
    }
};

// Reset password
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
        return res.status(400).json({
            success: false,
            errorCode: 'MISSING_TOKEN',
            message: 'Reset token is required'
        });
    }

    if (!password) {
        return res.status(400).json({
            success: false,
            errorCode: 'MISSING_PASSWORD',
            message: 'Password is required'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            errorCode: 'INVALID_PASSWORD',
            message: 'Password must be at least 6 characters'
        });
    }

    try {
        const user = await User.findOne({
            passwordResetToken: token,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                errorCode: 'INVALID_TOKEN',
                message: 'Invalid or expired reset token'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Password reset successful. You can now login with your new password.'
        });

    } catch (error) {
        console.error('Password reset error:', error);
        return res.status(500).json({
            success: false,
            errorCode: 'SERVER_ERROR',
            message: 'Something went wrong. Please try again.'
        });
    }
};

module.exports = {
    requestPasswordReset,
    verifyResetToken,
    resetPassword
};