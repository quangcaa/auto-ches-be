const { sequelize, Chat, User } = require('../db/models')
const { Op } = require('sequelize')
const { getIO, getConnectedUsers } = require('../socket/socket.be')

class InboxController {
    // @route [GET] /inbox
    // @desc Get all inbox
    // @access Private
    async getAllInbox(req, res) {
        const my_id = req.user_id
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
                                WHEN sender_id = ${my_id} THEN Receiver.username 
                                ELSE Sender.username 
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
                    ],
                    [
                        sequelize.literal(`
                            CASE 
                                WHEN sender_id = ${my_id} THEN Receiver.online 
                                ELSE Sender.online 
                            END
                        `), 
                        'online'
                    ]
                ],
                include: [
                    {
                        model: User,
                        as: 'Sender',
                        attributes: [],
                    },
                    {
                        model: User,
                        as: 'Receiver',
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
                group: ['user_id', 'user_name', 'online'],
                raw: true,
            })

            return res.status(200).json({
                success: true,
                data: chatUsers
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllInbox: ${error.message}`
            })
        }
    }


    // @route [GET] /inbox/:userId
    // @desc Get conversation
    // @access Private
    async getInboxMessage(req, res) {
        const my_id = req.user_id
        const other_user_id = req.params.userId

        try {
            const messages = await Chat.findAll({
                where: {
                    [Op.and]: [
                        {
                            [Op.or]: [
                                { sender_id: my_id, receiver_id: other_user_id },
                                { sender_id: other_user_id, receiver_id: my_id }
                            ]
                        }
                    ]
                },
                attributes: { 
                    exclude: ['chat_id'] 
                },
                order: [['time', 'ASC']],
                raw: true
            })

            return res.status(200).json({
                success: true,
                data: messages
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getConversation: ${error.message}`
            })
        }
    }

    // @route [DELETE] /inbox/delete-inbox/:userId
    // @desc Delete an inbox
    // @access Private
    async deleteInbox(req, res) {
        const my_id = req.user_id
        const other_user_id = req.params.userId
    
        try {
            const deletedCount = await Chat.destroy({
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
                }
            })
    
            if (deletedCount === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'No chats found to delete'
                })
            }
    
            return res.status(200).json({
                success: true,
                message: 'Inbox deleted successfully'
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in deleteInbox: ${error.message}`
            })
        }
    }
    
    // @route POST /inbox/send-message/:userId
    // @desc Send message from the current user to another user
    // @access Private
    async sendMessage(req, res) {
        const my_id = req.user_id
        const other_user_id = req.params.userId
        const { message } = req.body

        if (!message || message.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Message content cannot be empty'
            })
        }

        try {
            const newMessage = await Chat.create({
                sender_id: my_id,
                receiver_id: other_user_id,
                message: message,
                time: new Date(),
                game_id: null
            })

            return res.status(201).json({
                success: true,
                data: newMessage
            })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in sendMessage: ${error.message}`
            })
        }
    }
}

module.exports = new InboxController()