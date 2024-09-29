const { MailtrapClient } = require("mailtrap")
const dotenv = require('dotenv')

dotenv.config()

const TOKEN = process.env.MAILTRAP_TOKEN

const client = new MailtrapClient({
    token: TOKEN,
})

const sender = {
    email: "hello@demomailtrap.com",
    name: "♟Auto Chess",
}

// const recipients = [
//     {
//         email: "halloitsme115@gmail.com",
//     }
// ]

// client
//     .send({
//         from: sender,
//         to: recipients,
//         subject: "AutoChess - Activate Your Account",
//         text: "Congrats for sending test email with Mailtrap!",
//         category: "Integration Test",
//     })
//     .then(console.log, console.error)

module.exports = { client, sender }