const { sequelize, User, Follow, Game } = require('../db/models')

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
                SELECT u.user_id, u.username, u.joined_date, u.last_login, p.real_name, p.bio, p.flag, p.location
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
                SELECT g.game_id, g.variant_id, g.time_control_id, g.rated, g.start_time, g.end_time, g.result, g.status, g.current_fen
                FROM games g
                WHERE g.white_player_id = ? OR g.black_player_id = ?
                ORDER BY g.start_time DESC
                `,
                {
                    replacements: [userProfile[0].user_id, userProfile[0].user_id],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

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
                SELECT f.following_id, u.username, u.online, u.last_login
                FROM follows f
                JOIN users u ON u.user_id = f.following_id
                WHERE f.follower_id = ?
                `,
                {
                    replacements: [follower],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

            return res.status(200).json({ success: true, followingList })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllFollowing: ${error.message}`
            })
        }
    }


    // @route [POST] /@/:username/report
    // @desc report user
    // @access Private
    async reportUser(req, res) {
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
                SELECT f.following_id, u.username, u.online, u.last_login
                FROM follows f
                JOIN users u ON u.user_id = f.following_id
                WHERE f.follower_id = ?
                `,
                {
                    replacements: [follower],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

            return res.status(200).json({ success: true, followingList })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllFollowing: ${error.message}`
            })
        }
    }


    // @route [POST] /@/:username/challenge
    // @desc challenge user to a game
    // @access Private
    async challengeUser(req, res) {
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
                SELECT f.following_id, u.username, u.online, u.last_login
                FROM follows f
                JOIN users u ON u.user_id = f.following_id
                WHERE f.follower_id = ?
                `,
                {
                    replacements: [follower],
                    type: sequelize.QueryTypes.SELECT,
                }
            )

            return res.status(200).json({ success: true, followingList })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllFollowing: ${error.message}`
            })
        }
    }
}

module.exports = new ProfileController()
