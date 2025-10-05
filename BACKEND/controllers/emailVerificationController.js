const User = require('../models/User');
 
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

const handleEmailVerification = async (req, res) => {
    const { token } = req.params;
    
    if (!token) {
        return res.redirect(`${FRONTEND_URL}/verification-error?reason=missing_token`);
    }

    try {
        const user = await User.findOne({ 
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.redirect(`${FRONTEND_URL}/verification-error?reason=invalid_token`);
        }

        if (user.isEmailVerified) {
            return res.redirect(`${FRONTEND_URL}/verification-success?already=true`);
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        return res.redirect(`${FRONTEND_URL}/verification-success`);

    } catch (error) {
        console.error('Email verification error:', error);
        return res.redirect(`${FRONTEND_URL}/verification-error?reason=server_error`);
    }
};
module.exports = { handleEmailVerification };