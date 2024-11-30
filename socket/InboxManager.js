const { RECEIVE_INBOX_MESSAGE } = require('./message')

const handleSendMessage = async (data, io, connected_users) => {
    const { senderId, senderName, receiverId, message } = data

    if (!senderId || !senderName || !receiverId || !message) {
        console.error('Invalid message data:', data);
        return;
    }

    const sender_socket_id = connected_users.get(senderId)
    const receiver_socket_id = connected_users.get(receiverId)

    const messageData = {
        senderId: senderId,
        senderName: senderName,
        receiverId: receiverId,
        message: message,
        time: new Date(),
    }
    
    if (receiver_socket_id) {
        io.to(receiver_socket_id).emit(RECEIVE_INBOX_MESSAGE, messageData)
    } else {
        console.log("User not connected")
    }

    if (sender_socket_id) {
        io.to(sender_socket_id).emit(RECEIVE_INBOX_MESSAGE, messageData)
    }
}

module.exports = { handleSendMessage }