const { sequelize, User, Friendship, Game } = require('../db/models');

class ProfileController {
    // Return user profile (API).
    async getUserProfileById(req, res) {
        const id = parseInt(req.query.id);
        const currentUserId = req.user_id;
    
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
    

    // Update user profile (API).
    // This API IS only used for my profile !!!
    async updateUserProfile(req, res) {
        const id = parseInt(req.query.id);
        const { username, email, first_name, last_name, profile_picture, bio, dob, country } = req.body;
    
        try {
            const user = await User.findByPk(id, {
                attributes: ['user_id', 'username', 'email', 'first_name', 'last_name', 'profile_picture', 'bio', 'dob', 'country']
            });
            
            if (!user) {
                return res.status(404).json({ error: "User not found!" });
            }
    
            user.username = username || user.username;
            user.email = email || user.email;
            user.first_name = first_name || user.first_name;
            user.last_name = last_name || user.last_name;
            user.profile_picture = profile_picture || user.profile_picture;
            user.bio = bio || user.bio;
            user.dob = dob || user.dob;
            user.country = country || user.country;

            await user.save();
            res.status(200).json({ message: "Profile updated successfully!", user });
        } catch (error) {
            console.error("Error updating user profile: ", error);
            res.status(500).json({ error: "Error updating user profile!" });
        }
    }

    // Return user's friends along with their profile (API).
    async getFriend(req, res) {
        const userId = parseInt(req.query.id); 
        const query = `
            SELECT u.user_id, u.username, u.profile_picture, u.dob, u.country
            FROM friendships f
            JOIN users u ON (u.user_id = CASE 
                                            WHEN f.user_id = :userId THEN f.friend_id 
                                            ELSE f.user_id 
                                        END)
            WHERE f.status = 'accepted' AND (f.user_id = :userId OR f.friend_id = :userId);
        `;

        try {
            const results = await sequelize.query(query, {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            });

            res.status(200).json({
                friend_count: results.length,
                friends: results
            });
        } catch (error) {
            console.error("Error in getting user's friends: ", error);
            res.status(500).json({ error: "Error in getting user's friends!" });
        }
    }

    // Return user's friend requests that are pending (API).
    // This API IS only used for my profile !!!
    async getPendingFriendRequests(req, res) {
        const userId = parseInt(req.query.id); 
        const query = `
            SELECT u.user_id, u.username, u.profile_picture, u.dob, u.country
            FROM friendships f
            JOIN users u ON u.user_id = f.friend_id
            WHERE f.status = 'pending' AND f.user_id = :userId;
        `;

        try {
            const results = await sequelize.query(query, {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            });

            res.status(200).json({
                pending_request_count: results.length,
                pendingRequests: results
            });
        } catch (error) {
            console.error("Error in getting pending friend requests: ", error);
            res.status(500).json({ error: "Error in getting pending friend requests!" });
        }
    }

    // Return friend requests sent to the user (API).
    // This API IS only used for my profile !!!
    async getFriendRequestsFromOthers(req, res) {
        const userId = parseInt(req.query.id);
        const query = `
            SELECT u.user_id, u.username, u.profile_picture, u.dob, u.country
            FROM friendships f
            JOIN users u ON u.user_id = f.user_id
            WHERE f.status = 'pending' AND f.friend_id = :userId;
        `;

        try {
            const results = await sequelize.query(query, {
                replacements: { userId },
                type: sequelize.QueryTypes.SELECT
            });

            res.status(200).json({
                request_count: results.length,
                friendRequests: results
            });
        } catch (error) {
            console.error("Error in getting friend requests from others: ", error);
            res.status(500).json({ error: "Error in getting friend requests from others!" });
        }
    }
}

module.exports = new ProfileController();
