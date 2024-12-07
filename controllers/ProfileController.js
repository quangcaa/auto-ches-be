const { sequelize, User, Follow, Game, Challenge, Notification, Report } = require('../db/models')
const { getIO, getConnectedUsers } = require('../socket/socket.be')

class ProfileController {
    // @route [GET] /@/:username
    // @desc get user profile
    // @access Private
    async getUserProfile(req, res) {
        const { username } = req.params
        const current_user_id = req.user_id

        try {
            // fetch user profile
            const userProfile = await sequelize.query(
                `
                SELECT u.user_id, u.username, u.joined_date, p.real_name, p.bio, p.flag, p.location, u.online
                FROM users u
                JOIN profiles p ON u.user_id = p.user_id
                WHERE u.username = ?
                `,
                {
                    replacements: [username],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

            if (userProfile.length === 0) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // fetch user games
            const userGames = await sequelize.query(
                `
                SELECT 
                    g.*,
                    wu.username AS white_player_username,
                    bu.username AS black_player_username,
                    tc.time_control_name,
                    tc.base_time,
                    tc.increment_by_turn
                FROM games g
                LEFT JOIN users wu ON g.white_player_id = wu.user_id
                LEFT JOIN users bu ON g.black_player_id = bu.user_id
                LEFT JOIN timecontrols tc ON g.game_id = tc.game_id
                WHERE g.white_player_id = ? OR g.black_player_id = ?
                ORDER BY g.start_time DESC
                `,
                {
                    replacements: [userProfile[0].user_id, userProfile[0].user_id],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

            // fetch count of user posts
            const userPostCountData = await sequelize.query(
                `
                SELECT COUNT(*) AS post_count
                FROM posts
                WHERE user_id = ?
                `,
                {
                    replacements: [userProfile[0].user_id],
                    type: sequelize.QueryTypes.SELECT,
                }
            )
            const postCount = userPostCountData[0].post_count || 0
            userProfile[0].post_count = postCount

            return res.status(200).json({ success: true, profile: userProfile[0], games: userGames })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getUserProfile: ${error.message}`
            })
        }
    }


    // @route [GET] /@/:user_id/public
    // @desc get user public data (for GameInfo component)
    // @access Private
    async getUserPublic(req, res) {
        const { user_id } = req.params
        const current_user_id = req.user_id

        try {
            // fetch user public data
            const userData = await User.findByPk(user_id,
                { attributes: ['user_id', 'username'] }
            )

            if (!userData) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            return res.status(200).json({ success: true, user: userData })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getUserPublic: ${error.message}`
            })
        }
    }


    // @route [GET] /@/:username/following
    // @desc get all user's following
    // @access Private
    async getAllFollowing(req, res) {
        const { username } = req.params
        const follower = req.user_id

        try {
            const user = await User.findOne({ where: { username } })
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // fetch following list
            const followingList = await sequelize.query(
                `  
                SELECT f.following_id, u.username, u.online
                FROM follows f
                JOIN users u ON u.user_id = f.following_id
                WHERE f.follower_id = ?
                `,
                {
                    replacements: [user.user_id],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

            return res.status(200).json(followingList)
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllFollowing: ${error.message}`
            })
        }
    }


    // @route [GET] /@/:username/follower
    // @desc get all user's follower
    // @access Private
    async getAllFollower(req, res) {
        const { username } = req.params
        // const follower = req.user_id

        try {
            const user = await User.findOne({ where: { username } })
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            // fetch follower list
            const followerList = await sequelize.query(
                `  
                SELECT f.follower_id, u.username, u.online
                FROM follows f
                JOIN users u ON u.user_id = f.follower_id
                WHERE f.following_id = ?
                `,
                {
                    replacements: [user.user_id],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

            return res.status(200).json(followerList)
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllFollower: ${error.message}`
            })
        }
    }


    // @route [POST] /@/:username/report
    // @desc report user
    // @access Private
    async reportUser(req, res) {
        const { username } = req.params
        const { reason, description } = req.body
        const reporter_id = req.user_id

        try {
            const reportedUser = await User.findOne({ where: { username } })
            if (!reportedUser) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            const reported_id = reportedUser.user_id

            const newReport = await Report.create({
                reporter_id,
                reported_id,
                reason,
                description,
                created_at: new Date()
            })

            return res.status(201).json({
                success: true,
                message: 'Report submitted successfully.',
                report: newReport
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in reportUser: ${error.message}`
            })
        }
    }


    // @route [POST] /@/:username/challenge
    // @desc challenge user to a game
    // @access Private
    async challengeUser(req, res) {
        const { username } = req.params
        const inviter = req.user_id

        try {
            const challengedUser = await User.findOne({ where: { username } })
            if (!challengedUser) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            const receiver_id = challengedUser.user_id
            if (inviter === receiver_id) {
                return res.status(400).json({ success: false, message: 'You cannot challenge yourself.' })
            }

            const existingChallenge = await Challenge.findOne({
                where: {
                    sender_id: inviter,
                    receiver_id: receiver_id,
                    status: 'pending'
                }
            })
            if (existingChallenge) {
                return res.status(400).json({ success: false, message: 'A pending challenge already exists.' })
            }

            // update db
            const newChallenge = await Challenge.create({
                sender_id: inviter,
                receiver_id: receiver_id,
                status: 'pending',
                is_read: false,
                created_at: new Date()
            })

            // send socket.io
            const io = getIO()
            const connected_users = getConnectedUsers()
            const receipent_socket_id = connected_users.get(receiver_id)
            if (receipent_socket_id) {
                io.to(receipent_socket_id).emit('newChallenge', {
                    challenge_id: newChallenge.challenge_id,
                    sender_id: inviter,
                    receiver_id: receiver_id,
                    status: newChallenge.status,
                    created_at: newChallenge.created_at
                })
            } else {
                console.log(`User ${receiver_id} is not connected via Socket.IO.`)
            }

            return res.status(201).json({
                success: true,
                message: 'Challenge sent successfully.',
                challenge: {
                    challenge_id: newChallenge.challenge_id,
                    sender_id: newChallenge.sender_id,
                    receiver_id: newChallenge.receiver_id,
                    status: newChallenge.status,
                    created_at: newChallenge.created_at
                }
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in challengeUser: ${error.message}`
            })
        }
    }
}

module.exports = new ProfileController()
