

const { RECEIVE_INBOX_MESSAGE } = require('./message')

const handleSendMessage = async (data, io, connected_users) => {
    const { senderId, senderName, receiverId, message } = data
    console.log(data)

    if (!senderId || !senderName || !receiverId || !message) {
        console.error('Invalid message data:', data);
        return;
    }

    const receiver_socket_id = connected_users.get(receiverId)

    if (receiver_socket_id) {
        io.to(receiver_socket_id).emit(RECEIVE_INBOX_MESSAGE, {
            senderId: senderId,
            senderName: senderName,
            receiverId: receiverId,
            message: message,
            time: new Date(),
        });
    } else {
        console.log("User not connected")
    }
}

module.exports = { handleSendMessage }