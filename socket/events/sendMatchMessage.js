const { Chat } = require('../../db/models');

const handleSendMatchMessage = async (io, userSocketMap, senderId, data) => {
    const { toUserId, message, gameId } = data;
    const recipientSocketId = userSocketMap[toUserId.toString()];

    if (recipientSocketId) {
        io.to(recipientSocketId).emit('newMatchMessage', {
            message: message,
            senderId: senderId,
            time: new Date(),
        });
    }

    try {
        await Chat.create({
            sender_id: senderId,
            receiver_id: toUserId,
            message: message,
            time: new Date(),
            game_id: gameId
        });
    } catch (error) {
        console.error(`Error when saving message to the database: ${error.message}`);
    }
};

module.exports = { handleSendMatchMessage };
