const User = require('../models/User');

const handleLogout = async (req, res) => {
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    
    const refreshToken = cookies.jwt;

    try {

        const foundUser = await User.findOne({ refreshToken }).exec();
        
        if (!foundUser) {
            res.clearCookie('jwt', {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            });
            return res.sendStatus(204);
        }
        
        foundUser.refreshToken = '';
        await foundUser.save();
        
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        });
        return res.sendStatus(204);
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = {
    handleLogout
};