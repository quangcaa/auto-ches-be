const bcryptjs = require('bcryptjs')

const { sequelize, User } = require('../db/models')
const { Op } = require('sequelize')

const generateVerificationCode = require('../utils/generateVerificationCode')
const generateTokenAndSetCookie = require('../utils/generateTokenAndSetCookie')
const sendVerificationEmail = require('../mailtrap/email')

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
                verification_code_expires_at: Date.now() + 15 * 60 * 1000 // 15 minutes
            })

            // jwt 
            const token = generateTokenAndSetCookie(res, user.user_id)

            // verify email
            // await sendVerificationEmail(user.email, user.username, verificationCode)

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

    // @route POST /auth/verify-email
    // @desc Verify email to create account
    // @access Public
    async verifyEmail(req, res) {
        const { code } = req.body

        try {
            const user = await User.findOne({
                where: {
                    verification_code: code,
                    verification_code_expires_at: {
                        [Op.gt]: Date.now()
                    }
                }
            })

            if (!user) {
                return res.status(400).json({ success: false, message: 'Invalid or expired code' })
            }

            // update db
            await User.update(
                {
                    is_verified: true,
                    verification_code: null,
                    verification_code_expires_at: null
                },
                {
                    where: { user_id: user.user_id }
                }
            )

            res.status(200).json({ success: true, message: 'Email verified successfully' })
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message })
        }
    }

    // @route POST /auth/login
    // @desc Log in to play chess
    // @access Public
    async login(req, res) {

    }

    // @route POST /auth/logout
    // @desc Log out account
    // @access Private
    async logout(req, res) {

    }

}

module.exports = new AuthController()