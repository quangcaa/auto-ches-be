const { sequelize, User, Notification } = require('../db/models')
const { Op } = require('sequelize')

class NotificationController {

    // @route [GET] /notification/
    // @desc get all notifications
    // @access Private
    async getAllNotification(req, res) {
        const my_id = req.user_id

        try {
            const notifications = await sequelize.query(
                `  
                SELECT *
                FROM notifications n
                WHERE n.user_id = ?
                ORDER BY created_at DESC
                `,
                {
                    replacements: [my_id],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

            return res.status(200).json({ success: true, data: notifications })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllNotification: ${error.message}`
            })
        }
    }


    // @route [PATCH] /notification/mark-read/:notification_id
    // @desc mark 1 specific notification as read
    // @access Private
    async markReadSpecificNotification(req, res) {
        const { notification_id } = req.params
        const my_id = req.user_id

        console.log('hello')

        try {
            const result = await Notification.update(
                { is_read: true },
                { where: { notification_id } }
            )

            if (result[0] === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Notification not found.',
                });
            }

            return res.status(200).json({ success: true })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllNotification: ${error.message}`
            })
        }
    }


    // @route [PATCH] /notification/mark-all-read
    // @desc mark all read
    // @access Private
    async markAllReadNotification(req, res) {
        const my_id = req.user_id

        try {
            await Notification.update(
                { is_read: true },
                { where: { user_id: my_id } }
            )

            return res.status(200).json({ success: true, message: '"All notifications marked as read' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllNotification: ${error.message}`
            })
        }
    }


    // @route [DELETE] /notification/
    // @desc delete all notifications
    // @access Private
    async deleteAllNotification(req, res) {
        const my_id = req.user_id

        try {
            await sequelize.query(
                `  
                DELETE FROM notifications
                WHERE n.user_id = ?
                `,
                {
                    replacements: [my_id],
                    type: sequelize.QueryTypes.DELETE,
                }
            )

            return res.status(200).json({ success: true, message: 'Deleted all notification ;(' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllNotification: ${error.message}`
            })
        }
    }
}

module.exports = new NotificationController()