const jwt = require('jsonwebtoken')

const generateTokenAndSetCookie = (res, user_id) => {
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
    })

    res.cookie('token', token, {
        httpOnly: true, // XSS
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict', // CSRF
        maxAge: 24 * 60 * 60 * 1000
    })

    return token
}

module.exports = generateTokenAndSetCookie