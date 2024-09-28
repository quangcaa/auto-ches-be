const bcryptjs = require('bcryptjs')

const { sequelize, User } = require('../db/models')
const { Op } = require('sequelize')

const generateVerificationCode = require('../utils/generateVerificationCode')
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie')

class AuthController {
    // @route POST /auth/signup
    // @desc Sign up an account
    // @access Public
    async signup(req, res) {
        const { username, email, password } = req.body

        try {
            if (!username || !email || !password) {
                throw new Error('Some fields are missing')
            }

            // check if username for email exists
            const userAlreadyExists = await User.findOne({
                where: {
                    [Op.or]: [
                        { username },
                        { email }
                    ]
                }
            })
            if (userAlreadyExists) {
                return res.status(400).json({ success: false, message: 'User already exists' })
            }

            // create new account 
            const hashedPassword = await bcryptjs.hash(password, 12)
            const verificationCode = generateVerificationCode()

            const user = await User.create({
                username,
                email,
                password: hashedPassword,
                verification_code: verificationCode,
                verification_code_expires_at: Date.now() + 60 * 60 * 1000 // 1 hour
            })

            // jwt 
            const token = generateTokenAndSetCookie(res, user.user_id)

            const userObj = user.toJSON()
            delete userObj.password

            res.status(201).json({
                success: true,
                message: 'User created successfully',
                user: userObj,
                token
            })

        } catch (error) {
            return res.status(400).json({ success: false, message: error.message })
        }
    }
}

module.exports = new AuthController()