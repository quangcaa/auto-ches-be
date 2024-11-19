const { Chat } = require('../../db/models')
const { RECEIVE_INBOX_MESSAGE } = require('./message')

const handleSendMessage = async (data, io, connected_users) => {
    const { sender, receiver, message } = data

    if (!sender || !receiver || !message) {
        console.error('Invalid message data:', data);
        return;
    }

    const receiver_socket_id = connected_users.get(receiver)

    try {
        await Chat.create({
            sender_id: sender,
            receiver_id: receiver,
            message: message,
            time: new Date()
        })
    } catch (error) {
        console.log("Error in adding messages")
    }

    if (receiver_socket_id) {
        io.to(receiver_socket_id).emit(RECEIVE_INBOX_MESSAGE, {
            senderId: sender,
            message: message,
            time: new Date(),
        })
    } else {
        console.log("User not connected")
    }
}

module.exports = { handleSendMessage }