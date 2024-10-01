const { sequelize, User, Friendship } = require('../db/models');
const { Op } = require('sequelize');

class FriendshipController {
    // Decline and delete a friend request (API).
    async declineFriendRequest(req, res) {
        const user_id = req.user_id;
        const friend_id = parseInt(req.query.id);

        try {
            const deletedRequests = await Friendship.destroy({
                where: {
                    [Op.or]: [
                        { user_id: friend_id, friend_id: user_id},
                        { user_id: user_id, friend_id: friend_id}
                    ]
                }
            });

            if (deletedRequests === 0) {
                return res.status(404).json({ error: "Friend request not found or already processed!" });
            }

            res.status(200).json({ message: "Friend request declined and deleted successfully!" });
        } catch (error) {
            console.error("Error declining friend request: ", error);
            res.status(500).json({ error: "Error declining friend request!" });
        }
    }

    // Send a friend request (API).
    async sendFriendRequest(req, res) {
        const user_id = req.user_id;
        const friend_id = parseInt(req.query.id);

        try {
            const existingRequest = await Friendship.findOne({
                where: {
                    [Op.or]: [
                        { user_id: user_id, friend_id: friend_id },
                        { user_id: friend_id, friend_id: user_id }
                    ],
                    status: 'pending'
                }
            });

            if (existingRequest) {
                return res.status(400).json({ message: "Friend request already exists!" });
            }

            const newFriendship = await Friendship.create({
                user_id: user_id,
                friend_id: friend_id,
                status: 'pending',
                created_at: sequelize.fn('NOW'),
                updated_at: sequelize.fn('NOW')
            });

            res.status(201).json({ message: "Friend request sent successfully!", friendship: newFriendship });
        } catch (error) {
            console.log(error)
            res.status(500).json({ error: "Error sending friend request!" });
        }
    }


    // Accept a friend request (API).
    async acceptFriendRequest(req, res) {
        const userId = req.user_id;
        const friendId = parseInt(req.query.id);

        try {
            const friendRequest = await Friendship.findOne({
                where: {
                    user_id: friendId,
                    friend_id: userId,
                    status: 'pending'
                }
            });

            if (!friendRequest) {
                return res.status(404).json({ error: "Friend request not found!" });
            }

            friendRequest.status = 'accepted';
            friendRequest.updated_at = sequelize.fn('NOW');
            await friendRequest.save();

            res.status(200).json({ message: "Friend request accepted successfully!" });
        } catch (error) {
            console.error("Error accepting friend request: ", error);
            res.status(500).json({ error: "Error accepting friend request!" });
        }
    }
}

module.exports = new FriendshipController();
