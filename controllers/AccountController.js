const bcryptjs = require('bcryptjs')

const { sequelize, User, Profile } = require('../db/models')
const { Op } = require('sequelize')
const { check } = require('express-validator')

class AccountController {
    // @route [GET] /account/my-profile
    // @desc get my profile in efit setting
    // @access Private
    async getMyProfile(req, res) {
        const user_id = req.user_id

        try {
            const myProfile = await Profile.findByPk(user_id)
            if (!myProfile) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            return res.status(200).json({ success: true, profile: myProfile })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getMyProfile: ${error.message}`
            })
        }
    }

    // @route [PUT] /account/edit-profile
    // @desc edit profile in setting
    // @access Private
    async editProfile(req, res) {
        const user_id = req.user_id
        const { bio, real_name, location, flag } = req.body

        try {
            const [updatedProfile] = await Profile.update(
                { bio, real_name, location, flag },
                { where: { user_id } }
            )

            // check update
            if (updatedProfile === 0) {
                return res.status(400).json({ success: false, message: 'No changes made' })
            }

            return res.status(200).json({ success: true, message: 'Profile updated successfully' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in editProfile: ${error.message}`
            })
        }
    }

    // @route [PATCH] /account/change-password
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

    // @route [DELETE] /account/close-account
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

            return res.status(200).json({ success: true, message: 'Account deleted :(' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in closeAccount: ${error.message}`
            })
        }
    }
}

module.exports = new AccountController()