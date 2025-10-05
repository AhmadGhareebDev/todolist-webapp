const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,       
    port: process.env.EMAIL_PORT,        
    secure: false,                    
    auth: {
        user: process.env.EMAIL_USER,    
        pass: process.env.EMAIL_PASS,    
    },
});

const sendVerificationEmail = async (email, username, verificationToken) => {
    const verificationUrl = `${process.env.VERIFICATION_URL}/${verificationToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verify Your Email - TodoList App',
        html: `
            <h2>Welcome to TodoList App!</h2>
            <p>Hi ${username || 'there'},</p>
            <p>Thank you for registering. Please click the button below to verify your email address:</p>
            <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Verify Email</a>
            <p>Or copy this link: ${verificationUrl}</p>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending verification email:', error);
        return false;
    }
};

const sendPasswordResetEmail = async (email, username, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Reset Your Password - TodoList App',
        html: `
            <h2>Password Reset Request</h2>
            <p>Hi ${username || 'there'},</p>
            <p>We received a request to reset your password. Click the button below to reset it:</p>
            <a href="${resetUrl}" style="background-color: #0ea5e9; color: white; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 4px;">Reset Password</a>
            <p>Or copy this link: ${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
        return true;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
};

module.exports = {
    sendVerificationEmail,
    sendPasswordResetEmail
};