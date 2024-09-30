const { sequelize, User, Friendship } = require('../db/models');
const { Op } = require('sequelize');

class FriendshipController {
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

module.exports = new FriendshipController();
