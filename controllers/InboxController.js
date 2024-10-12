const { sequelize, Chat, User } = require('../db/models');
const { Op } = require('sequelize');

class InboxController {
    // @route GET /inbox
    // @desc Get all inbox
    // @access Private
    async getAllInbox(req, res) {
        const my_id = req.user_id;
        try {
            const chatUsers = await Chat.findAll({
                attributes: [
                    [
                        sequelize.literal(`
                            CASE 
                                WHEN sender_id = ${my_id} THEN receiver_id 
                                ELSE sender_id 
                            END
                        `), 
                        'user_id'
                    ],
                    [
                        sequelize.literal(`
                            CASE 
                                WHEN sender_id = ${my_id} THEN chat_receiver_id_fk.username 
                                ELSE chat_sender_id_fk.username 
                            END
                        `), 
                        'user_name'
                    ],
                    [
                        sequelize.fn('MAX', sequelize.col('time')), 
                        'last_message_time'
                    ],
                    [
                        sequelize.literal(`
                            (SELECT message 
                             FROM chats AS innerChat 
                             WHERE innerChat.time = MAX(Chat.time) 
                             LIMIT 1)
                        `), 
                        'last_message'
                    ]
                ],
                include: [
                    {
                        model: User,
                        as: 'chat_sender_id_fk',
                        attributes: [],
                    },
                    {
                        model: User,
                        as: 'chat_receiver_id_fk',
                        attributes: [],
                    }
                ],
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { sender_id: my_id },
                                { receiver_id: my_id }
                            ]
                        },
                        { game_id: null }
                    ]
                },
                group: ['user_id', 'user_name'],
                raw: true,
            });

            return res.status(200).json({
                success: true,
                data: chatUsers
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllInbox: ${error.message}`
            });
        }
    }

    // @route GET /inbox/messages/:userId
    // @desc Get messages between the current user and other user
    // @access Private
    async getInboxMessage(req, res) {
        const my_id = req.user_id;
        const other_user_id = req.params.userId;

        try {
            const messages = await Chat.findAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { sender_id: my_id, receiver_id: other_user_id },
                                { sender_id: other_user_id, receiver_id: my_id }
                            ]
                        },
                        { game_id: null }
                    ]
                },
                attributes: { 
                    exclude: ['game_id', 'chat_id'] 
                },
                order: [['time', 'ASC']],
                raw: true
            });

            return res.status(200).json({
                success: true,
                data: messages
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getConversation: ${error.message}`
            });
        }
    }
}
module.exports = new InboxController();
