const { sequelize, User, Friendship, Game } = require('../db/models');

class ProfileController {
    // Return user profile (API).
    async getUserProfileById(req, res) {
        const id = parseInt(req.query.id);
        try {
            const rawQuery = `
                SELECT 
                    u.user_id, u.username, u.email, u.first_name, u.last_name, 
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
                        SELECT JSON_ARRAYAGG(JSON_OBJECT('id', uf.user_id, 'name', uf.username, 'avatar', uf.profile_picture))
                        FROM friendships f
                        JOIN users uf ON uf.user_id = CASE 
                            WHEN f.user_id = :userId THEN f.friend_id 
                            ELSE f.user_id 
                        END
                        WHERE f.status = 'accepted' AND (f.user_id = :userId OR f.friend_id = :userId)
                        LIMIT 5
                    ) AS friends,

                    (
                        SELECT JSON_ARRAYAGG(JSON_OBJECT('game_id', g.game_id, 'start_time', g.start_time))
                        FROM games g
                        WHERE g.white_player_id = :userId OR g.black_player_id = :userId
                        ORDER BY g.start_time DESC
                        LIMIT 5
                    ) AS recent_games

                FROM users u
                WHERE u.user_id = :userId;
            `;

            const result = await sequelize.query(rawQuery, {
                replacements: { userId: id },
                type: sequelize.QueryTypes.SELECT,
                plain: true
            });

            if (!result) {
                return res.status(404).json({ error: "User profile does not exist!" });
            }

            res.status(200).json(result);
        } catch (error) {
            console.error("Error in getting user profile: ", error);
            res.status(500).json({ error: "Error in getting user profile!" });
        }
    }

    // Update user profile (API).
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
}

module.exports = new ProfileController();
