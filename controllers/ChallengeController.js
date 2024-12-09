const { Challenge } = require('../db/models')
const shortid = require('shortid');
const { Op } = require('sequelize')
const { getIO, getConnectedUsers } = require('../socket/socket.be')

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

    // @route [POST] /challenge/accept/:challenge_id
    // @desc accept a challenge
    // @access Private
    async acceptChallenge(req, res) {
        const { challenge_id } = req.params
        const receiver_id = req.user_id

        try {
            const challenge = await Challenge.findOne({ where: { challenge_id, receiver_id, status: 'pending' } })
            if (!challenge) {
                return res.status(400).json({ success: false, message: 'Challenge not found or already processed' })
            }

            // Create a new game
            const game = await Game.create({
                white_player_id: challenge.sender_id,
                black_player_id: receiver_id,
                status: 'PENDING',
                start_time: new Date(),
            })

            // Update challenge status
            challenge.status = 'accepted'
            challenge.game_id = game.game_id
            await challenge.save()

            // Notify challenger
            const io = getIO()
            const connected_users = getConnectedUsers()
            const challenger_socket_id = connected_users.get(challenge.sender_id)
            if (challenger_socket_id) {
                io.to(challenger_socket_id).emit('challengeAccepted', { game_id: game.game_id })
            }

            return res.status(200).json({ success: true, game_id: game.game_id })
        } catch (error) {
            return res.status(400).json({ success: false, message: `Error in acceptChallenge: ${error.message}` })
        }
    }

    // @route [POST] /challenge/decline/:challenge_id
    // @desc decline a challenge
    // @access Private
    async declineChallenge(req, res) {
        const { challenge_id } = req.params
        const receiver_id = req.user_id

        try {
            const challenge = await Challenge.findOne({ where: { challenge_id, receiver_id, status: 'pending' } })
            if (!challenge) {
                return res.status(400).json({ success: false, message: 'Challenge not found or already processed' })
            }

            // update challenge status
            challenge.status = 'declined'
            await challenge.save()

            // notify challenger via socket
            const io = getIO()
            const connected_users = getConnectedUsers()
            const challenger_socket_id = connected_users.get(challenge.sender_id)
            if (challenger_socket_id) {
                io.to(challenger_socket_id).emit('challengeDeclined', { challenge_id: challenge.challenge_id })
            }

            return res.status(200).json({ success: true })
        } catch (error) {
            return res.status(400).json({ success: false, message: `Error in declineChallenge: ${error.message}` })
        }
    }
}

module.exports = new NotificationController()