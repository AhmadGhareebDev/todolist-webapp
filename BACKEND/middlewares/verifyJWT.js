const jwt = require('jsonwebtoken');
const ACCESS_SECRET_TOKEN = process.env.ACCESS_SECRET_TOKEN;

const verifyJWT = (req, res, next) => {
    if (!req?.headers?.authorization) {
        return res.status(401).json({
            success: false,
            errorCode: "NO_AUTH_HEADER",
            message: 'Unauthorized: No authorization header provided.'
        });
    }

    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            errorCode: "INVALID_AUTH_HEADER",
            message: 'Unauthorized: Invalid authorization header.'
        });
    }

    const accessToken = authHeader.split(' ')[1];

    jwt.verify(
        accessToken,
        ACCESS_SECRET_TOKEN,
        (error, decoded) => {
            if (error) {
                return res.status(403).json({
                    success: false,
                    errorCode: "INVALID_ACCESS_TOKEN",
                    message: 'Forbidden: Invalid or expired access token.'
                });
            }
            
            req.email = decoded.email;       
            req.username = decoded.username; 
            req.user = decoded;          
            next();
        }
    );
};

module.exports = verifyJWT;