const { sequelize, User, Follow, Notification } = require('../db/models')
const { Op } = require('sequelize')
const { getIO, getConnectedUsers } = require('../socket/socket.be')
const { SEND_NOTIFICATION } = require('../socket/message')

class RelationController {
    // @route [POST] /rel/follow/:username
    // @desc follow user
    // @access Private
    async follow(req, res) {
        const { username } = req.params
        const my_id = req.user_id

        try {
            // check user exists
            const user = await User.findOne({
                where: { username },
                attributes: ['user_id']
            })
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // check if followed
            const checkFollow = await Follow.findOne({
                where: {
                    follower_id: my_id,
                    following_id: user.user_id
                }
            })
            if (checkFollow) {
                return res.status(400).json({ success: false, message: 'Already followed' })
            }

            // follow
            const followed = await Follow.create({
                follower_id: my_id,
                following_id: user.user_id
            })

            // update notification db
            await Notification.create({
                user_id: followed.following_id,
                type: 'follow',
                content: 'followed you',
                source_id: followed.follower_id,
                created_at: new Date()
            })

            // send socket
            const connected_users = getConnectedUsers()
            const io = getIO()

            const receiver_socket_id = connected_users.get(followed.following_id)
            if (receiver_socket_id) {
                io.to(receiver_socket_id).emit(SEND_NOTIFICATION, {
                    senderId: followed.follower_id,
                    receiverId: followed.following_id,
                });
            } else {
                console.log("User not connected")
            }

            return res.status(200).json({ success: true, message: 'Followed' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in follow: ${error}`
            })
        }
    }

    // @route [DELETE] /rel/unfollow/:username
    // @desc unfollow user
    // @access Private
    async unfollow(req, res) {
        const { username } = req.params
        const my_id = req.user_id

        try {
            const user = await User.findOne({
                where: { username },
                attributes: ['user_id']
            })
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // check if haven't follow yet
            const checkFollow = await Follow.findOne({
                where: {
                    follower_id: my_id,
                    following_id: user.user_id
                }
            })
            if (!checkFollow) {
                return res.status(400).json({ success: false, message: 'Have not followed yet' })
            }

            // unfollow
            const unfollowed = await Follow.destroy({
                where: {
                    follower_id: my_id,
                    following_id: user.user_id
                }
            })

            // update notification db
            await Notification.destroy({
                where: {
                    user_id: checkFollow.following_id,
                    source_id: checkFollow.follower_id,
                    type: 'follow' 
                }
            })

            if (unfollowed === 0) {
                return res.status(400).json({ success: false, message: 'Unfollow failed' })
            }

            return res.status(200).json({ success: true, message: 'Unfollowed' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in unfollow: ${error}`
            })
        }
    }

}

module.exports = new RelationController()