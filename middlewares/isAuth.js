const dotenv = require('dotenv')

dotenv.config()

const { User } = require('../db/models')
const { verifyToken } = require('../utils/authen')

const isAuth = async (req, res, next) => {
    // get access-token from header
    const accessTokenFromHeader = req.headers['authorization']?.split(' ')[1];
    console.log(req.headers)
    if (!accessTokenFromHeader) {
        return res.status(400).json({ success: false, message: 'Access token not found' })
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

    // verify 
    const verified = await verifyToken(
        accessTokenFromHeader,
        accessTokenSecret
    )
    if (!verified) {
        return res.status(401).json({ success: false, message: 'Invalid access token - You do not have access to this feature' })
    }

    // get user data
    const user = await User.findByPk(verified.payload.user_id, {
        attributes: { exclude: ['password', 'verification_code', 'verification_code_expires_at', 'refresh_token'] }
    })
    if (!user) {
        return res.status(400).json({ success: false, message: 'User not found' })
    }

    req.user_id = user.user_id

    next()
}

module.exports = isAuth