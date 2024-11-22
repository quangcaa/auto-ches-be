const { Challenge } = require('../db/models')
const { Op } = require('sequelize')

class NotificationController {

    // @route [GET] /challenge/
    // @desc get all challenges
    // @access Private
    async getAllChallenge(req, res) {
        const my_id = req.user_id

        try {
            const challenges = await Challenge.findAll({
                where: {
                    receiver_id: my_id
                },
                order: [['created_at', 'DESC']]
            })

            return res.status(200).json({ success: true, data: challenges })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllChallenge: ${error.message}`
            })
        }
    }
}

module.exports = new NotificationController()