const { QueryTypes } = require('sequelize');
const { sequelize, User, Follow, Game } = require('../db/models')

class ProfileController {
    // @route GET /@/:username
    // @desc get user profile
    // @access Private
    async getUserProfile(req, res) {
        const { user_id } = req.params
        const currentUserId = req.user_id

        try {
            const rawQuery = `
                SELECT u.user_id, u.username, u.email, u.first_name, u.last_name, 
                    u.profile_picture, u.bio, u.dob, u.country, u.last_login,
                    (
                        SELECT COUNT(*) 
                        FROM friendships f 
                        WHERE f.status = 'accepted' AND (f.user_id = :userId OR f.friend_id = :userId)
                    ) AS friend_count,
    
                    (
                        SELECT COUNT(*) 
                        FROM games g 
                        WHERE g.white_player_id = :userId OR g.black_player_id = :userId
                    ) AS game_count,
    
                    (
                        SELECT JSON_ARRAYAGG(user_data)
                        FROM (
                            SELECT JSON_OBJECT('id', uf.user_id, 'name', uf.username, 'avatar', uf.profile_picture) AS user_data
                            FROM friendships f
                            JOIN users uf ON uf.user_id = CASE 
                                WHEN f.user_id = :userId THEN f.friend_id 
                                ELSE f.user_id 
                            END
                            WHERE f.status = 'accepted' AND (f.user_id = :userId OR f.friend_id = :userId)
                            LIMIT 5
                        ) AS limited_friends
                    ) AS friends,
    
                    (
                        SELECT JSON_ARRAYAGG(game_data)
                        FROM (
                            SELECT JSON_OBJECT('game_id', g.game_id, 'start_time', g.start_time) AS game_data
                            FROM games g
                            WHERE g.white_player_id = :userId OR g.black_player_id = :userId
                            ORDER BY g.start_time DESC
                            LIMIT 5
                        ) AS limited_games
                    ) AS recent_games,

                    (
                        SELECT f.status 
                        FROM friendships f 
                        WHERE (f.user_id = :currentUserId AND f.friend_id = :userId) 
                        OR (f.user_id = :userId AND f.friend_id = :currentUserId)
                        LIMIT 1
                    ) AS friendship_status
    
                FROM users u
                WHERE u.user_id = :userId;
            `;

            let result = await sequelize.query(rawQuery, {
                replacements: { userId: id, currentUserId },
                type: sequelize.QueryTypes.SELECT,
                plain: true
            });

            if (!result) {
                return res.status(404).json({ error: "User profile does not exist!" });
            }

            if (currentUserId === id) {
                const additionalQuery = `
                    SELECT 
                        (
                            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', uf.user_id, 'name', uf.username, 'avatar', uf.profile_picture))
                            FROM friendships f
                            JOIN users uf ON uf.user_id = f.friend_id
                            WHERE f.status = 'pending' AND f.user_id = :currentUserId
                            LIMIT 5
                        ) AS pending_requests,
    
                        (
                            SELECT JSON_ARRAYAGG(JSON_OBJECT('id', uf.user_id, 'name', uf.username, 'avatar', uf.profile_picture))
                            FROM friendships f
                            JOIN users uf ON uf.user_id = f.user_id
                            WHERE f.status = 'pending' AND f.friend_id = :currentUserId
                            LIMIT 5
                        ) AS invitations,

                        (
                            SELECT COUNT(*)
                            FROM friendships f
                            WHERE f.status = 'pending' AND f.user_id = :currentUserId
                        ) AS pending_request_count,

                        (
                            SELECT COUNT(*)
                            FROM friendships f
                            WHERE f.status = 'pending' AND f.friend_id = :currentUserId
                        ) AS invitation_count`;

                const additionalResult = await sequelize.query(additionalQuery, {
                    replacements: { currentUserId },
                    type: sequelize.QueryTypes.SELECT,
                    plain: true
                });

                result = { ...result, ...additionalResult };
            } else {
                if (result.friendship_status === null) {
                    result.friendship_status = "no";
                }
            }

            res.status(200).json(result);
        } catch (error) {
            console.error("Error in getting user profile: ", error);
            res.status(500).json({ error: "Error in getting user profile!" });
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
}

module.exports = new ProfileController()
