const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createValidator } = require('express-joi-validation');
const Joi = require('joi');

const validator = createValidator({});
const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address.',
      'string.empty': 'Email is required.',
      'any.required': 'Email is required.'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'Password must be at least 6 characters long.',
      'string.empty': 'Password is required.',
      'any.required': 'Password is required.'
    })
});

const handleLogin = async (req, res) => {
  try {
    await validator.body(loginSchema)(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          errorCode: 'INVALID_INPUT',
          message: err.details[0].message
        });
      }
    });

    const { email, password } = req.body;

    const foundUser = await User.findOne({ email: email.toLowerCase() }).exec();
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        errorCode: 'USER_NOT_FOUND',
        message: 'The email is incorrect.'
      });
    }

    if (!foundUser.isEmailVerified) {
      return res.status(401).json({
        success: false,
        errorCode: 'EMAIL_NOT_VERIFIED',
        message: 'Please verify your email before logging in. Check your inbox for verification link.'
      });
    }

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match) {
      return res.status(401).json({
        success: false,
        errorCode: 'INVALID_PASSWORD',
        message: 'The password is incorrect.'
      });
    }

    const UserInfo = {
      email: foundUser.email,
      username: foundUser.username
    };

    const accessToken = jwt.sign(
      UserInfo,
      ACCESS_SECRET_TOKEN,
      { expiresIn: '1d' }
    );
    const refreshToken = jwt.sign(
      UserInfo,
      REFRESH_SECRET_TOKEN,
      { expiresIn: '100d' }
    );

    try {
      foundUser.refreshToken = refreshToken;
      await foundUser.save();
    } catch (error) {
      return res.status(500).json({
        success: false,
        errorCode: 'SERVER_ERROR',
        message: 'Failed to save refresh token.'
      });
    }

    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      data: {
        accessToken,
        user: {
          email: foundUser.email,
          username: foundUser.username,
          isEmailVerified: foundUser.isEmailVerified
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      errorCode: 'SERVER_ERROR',
      message: 'Login failed due to server error.'
    });
  }
};

module.exports = { handleLogin };