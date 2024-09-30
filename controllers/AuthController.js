const bcryptjs = require('bcryptjs')
const dotenv = require('dotenv')
const randtoken = require('rand-token')
const jwt = require('jsonwebtoken')

dotenv.config()

const { sequelize, User } = require('../db/models')
const { Op } = require('sequelize')

const generateVerificationCode = require('../utils/generateVerificationCode')
const { generateAccessToken, decodeToken } = require('../utils/authen')
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
        const { username, password } = req.body

        try {
            if (!username || !password) {
                throw new Error('Some fields are missing')
            }

            // check username 
            const user = await User.findOne({
                where: {
                    username
                }
            })
            if (!user) {
                return res.status(400).json({ success: false, message: 'Username doesn\'t exist' })
            }

            // check password
            const isPasswordValid = bcryptjs.compareSync(password, user.password) // dong bo
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, message: 'Your password is invalid' })
            }

            // generate access token
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE
            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
            const dataForAccessToken = {
                user_id: user.user_id,
            }
            const accessToken = await generateAccessToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife
            )

            // generate refresh token
            let refreshToken = randtoken.generate(32)
            if (!user.refresh_token) {
                await User.update(
                    {
                        refresh_token: refreshToken,
                    },
                    {
                        where: { user_id: user.user_id }
                    }

                )
            } else {
                refreshToken = user.refresh_token
            }

            return res.status(200).json({ success: true, message: 'Log in successfully', accessToken, refreshToken })
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message })
        }
    }

    // @route POST /auth/refresh
    // @desc generate new access-token when expired
    // @access Private
    async refreshToken(req, res) {
        try {
            // get access-token from header
            const accessTokenFromHeader = req.headers.x_authorization
            if (!accessTokenFromHeader) {
                return res.status(400).json({ success: false, message: 'Access token is missing' })
            }

            // get refresh-token from body
            const refreshTokenFromBody = req.body.refreshToken
            if (!refreshTokenFromBody) {
                return res.status(400).json({ success: false, message: 'Refresh token is missing' })
            }

            const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
            const accessTokenLife = process.env.ACCESS_TOKEN_LIFE

            // decode access-token
            const decoded = await decodeToken(accessTokenFromHeader, accessTokenSecret)
            if (!decoded) {
                return res.status(400).json({ success: false, message: 'Invalid access token' })
            }

            // if access-token valid
            const user_id = decoded.payload.user_id

            const user = await User.findOne({ where: { user_id } })
            if (!user) {
                return res.status(400).json({ success: false, message: 'User does not exist' })
            }

            // refresh-token req vs database
            if (refreshTokenFromBody !== user.refresh_token) {
                return res.status(400).json({ success: false, message: 'Invalid refresh token' })
            }

            // create new access-token (if refresh-token valid)
            const dataForAccessToken = { user_id }
            const accessToken = await generateAccessToken(
                dataForAccessToken,
                accessTokenSecret,
                accessTokenLife,
            )
            if (!accessToken) {
                return res.status(400).json({ success: false, message: 'Failed to create access token, please try again' })
            }

            return res.status(200).json({ accessToken })
        } catch (error) {
            return res.status(400).json({ success: false, message: error.message })
        }
    }

    // @route POST /auth/logout
    // @desc Log out account
    // @access Private
    async logout(req, res) {
        console.log(req.user)
        return res.status(200).json({ success: true })
    }
}

module.exports = new AuthController()