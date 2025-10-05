const User = require('../models/User');
const jwt = require('jsonwebtoken');
const REFRESH_SECRET_TOKEN = process.env.REFRESH_SECRET_TOKEN;
const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;


const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
     if (!cookies?.jwt) return res.status(401).json({
        success: false,
        message: 'Unauthorized'
    });

    const refreshToken = cookies.jwt;

    try {
        const foundUser = await User.findOne({ refreshToken }).exec();
        if(!foundUser) return res.status(403).json({
        success: false,
        message: 'Forbidden'
    });

    jwt.verify(
        refreshToken ,
        REFRESH_SECRET_TOKEN,
        (error , decoded) => {
            if(error || decoded.email !== foundUser.email) {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden'
                })
            }

            const UserInfo = {
                email: foundUser.email , 
                username: foundUser.username
            }
            const accessToken = jwt.sign(
                UserInfo,
                ACCESS_SECRET_TOKEN,
                {expiresIn: '15m'}
            )

           // In handleRefreshToken - just add user to the response
            return res.status(200).json({
            success: true,
            message: '',
            data: {
                accessToken: accessToken,
                user: {  // Add this!
                email: foundUser.email,
                username: foundUser.username,
                isEmailVerified: foundUser.isEmailVerified
        }
    }
})

        }
    )

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `${error.message}`,
        })
    }
}


module.exports = {
    handleRefreshToken
}