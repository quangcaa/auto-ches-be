const bcryptjs = require('bcryptjs')
const crypto = require('crypto')

const { sequelize, User } = require('../db/models')
const { Op } = require('sequelize')
const { check } = require('express-validator')

class AccountController {
    // @route POST /account/change-username
    // @desc change username in setting
    // @access Private
    async changeUsername(req, res) {
        const user_id = req.user_id
        const { new_username } = req.body

        try {
            const user = await User.findByPk(user_id)
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // check if username exists
            const checkUsernameExists = await User.findOne({ where: { username: new_username } })
            if (checkUsernameExists) {
                return res.status(400).json({ success: false, message: 'Username already exists' })
            }

            // check if username still not change
            if (user.username === new_username) {
                return res.status(400).json({ success: false, message: 'Choose other username' })
            }

            // update username 
            user.username = new_username
            await user.save()

            return res.status(200).json({ success: false, message: 'Username changed successfully', username: user.username })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in changeUsername: ${error.message}`
            })
        }
    }

    // @route POST /account/change-password
    // @desc change password in setting
    // @access Private
    async changePassword(req, res) {
        const user_id = req.user_id
        const { current_password, new_password, retype_new_password } = req.body

        try {
            const user = await User.findByPk(user_id)
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // check current_password
            const isCurrentPasswordValid = bcryptjs.compareSync(current_password, user.password)
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ success: false, message: 'Current password is wrong' })
            }

            // check retype password
            if (new_password !== retype_new_password) {
                return res.status(400).json({ success: false, message: 'The password fields must match' })
            }

            // hash new password & update
            const hashedNewPassword = await bcryptjs.hash(new_password, 12)
            user.password = hashedNewPassword
            await user.save()

            return res.status(200).json({ success: false, message: 'Password changed successfully' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in changePassword: ${error.message}`
            })
        }
    }

    // @route POST /account/change-email
    // @desc change email in setting
    // @access Private
    async changeEmail(req, res) {
        const user_id = req.user_id
        const { current_password, new_email } = req.body

        try {
            const user = await User.findByPk(user_id)
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // check current_password
            const isCurrentPasswordValid = bcryptjs.compareSync(current_password, user.password)
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ success: false, message: 'Current password is wrong' })
            }

            // check new_email
            const checkEmailExists = await User.findOne({ where: { email: new_email } })
            if (checkEmailExists) {
                return res.status(400).json({ success: false, message: 'Email already exists' })
            }

            // check if email still not change
            if (user.email === new_email) {
                return res.status(400).json({ success: false, message: 'Choose other email' })
            }

            // update new email
            user.email = new_email
            await user.save()

            return res.status(200).json({ success: false, message: 'Email changed successfully', email: new_email })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in changeEmail: ${error.message}`
            })
        }
    }

    // @route POST /account/close-account
    // @desc close account permanent
    // @access Private
    async closeAccount(req, res) {
        const user_id = req.user_id
        const { password } = req.body

        try {
            const user = await User.findByPk(user_id)
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // check password
            const isPasswordValid = bcryptjs.compareSync(password, user.password)
            if (!isPasswordValid) {
                return res.status(400).json({ success: false, message: 'Incorrect password' })
            }

            // delete the account
            await User.destroy({ where: { user_id } })

            return res.status(200).json({ success: false, message: 'Account deleted :(' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in closeAccount: ${error.message}`
            })
        }
    }
}

module.exports = new AccountController()