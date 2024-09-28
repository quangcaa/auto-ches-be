const { body, validationResult } = require('express-validator')

const validateSignup = [
    body('username')
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 8, max: 30 }).withMessage('Username must be 8-30 characters'),
    body('email')
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 36 }).withMessage('Password must be 6-36 characters'),
    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, message: errors.array() })
        }
        next()
    }
]

module.exports = validateSignup