const { Chat } = require('../../db/models');

const handleSendMessage = async (io, userSocketMap, senderId, data) => {
    const { toUserId, message } = data;
    const recipientSocketId = userSocketMap[toUserId.toString()];

    if (recipientSocketId) {
        io.to(recipientSocketId).emit('newMessage', {
            message: message,
            senderId: senderId,
            time: new Date(),
        });
    } else {
        console.log("User not connected");
    }

    try {
        await Chat.create({
            sender_id: senderId,
            receiver_id: toUserId,
            message: message,
            time: new Date()
        });
    } catch (error) {
        console.log("Error in adding messages");
    }
};

module.exports = { handleSendMessage };