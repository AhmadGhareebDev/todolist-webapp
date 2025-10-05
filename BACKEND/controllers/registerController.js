const User = require('../models/User');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../services/emailService');

const handleRegister = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            errorCode: "MISSING_FIELDS",
            message: 'Username, email, and password are required.'
        });
    }

    try {
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                errorCode: "EMAIL_EXISTS",
                message: 'An account with this email already exists.'
            });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(409).json({
                success: false,
                errorCode: "USERNAME_EXISTS", 
                message: 'This username is already taken.'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const verificationToken = crypto.randomBytes(32).toString('hex');
        
        const tokenExpiration = new Date();
        tokenExpiration.setHours(tokenExpiration.getHours() + 24);

        const newUser = await User.create({
            username: username,
            email: email.toLowerCase(),        
            password: hashedPassword,        
            isEmailVerified: false,             
            emailVerificationToken: verificationToken,
            emailVerificationExpires: tokenExpiration   
        });

        const emailSent = await sendVerificationEmail(email, username, verificationToken);
        
        if (!emailSent) {
            return res.status(500).json({
                success: false,
                errorCode: "EMAIL_SEND_FAILED",
                message: 'Failed to send verification email. Please try again.'
            });
        }

        return res.status(201).json({
            success: true,
            message: 'User registered successfully! Please check your email to verify your account.',
            data: {
                username: newUser.username,
                email: newUser.email,
                isEmailVerified: newUser.isEmailVerified
            }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            errorCode: "SERVER_ERROR",
            message: 'Failed to register user.'
        });
    }
};

module.exports = { handleRegister };