const { MailtrapClient } = require('mailtrap')
const { client, sender } = require('./config')
const { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE } = require('./emailTemplate')

const sendVerificationEmail = async (email, username, verificationCode) => {
    const recipient = [{ email }]

    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Verify your email',
            html: VERIFICATION_EMAIL_TEMPLATE.replace('{verificationCode}', verificationCode).replace('{username}', username),
            category: 'Email Verification'
        })

        console.log('Email sent successfully', res)
    } catch (error) {
        console.log(`Error sending verification`, error)
        throw new Error(`Error sending verification email: ${error}`)
    }
}

const sendPasswordResetEmail = async (email, resetURL) => {
    const recipient = [{ email }]

    try {
        const res = await client.send({
            from: sender,
            to: recipient,
            subject: 'Reset your password',
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace('{resetURL}', resetURL),
            category: 'Password Reset'
        })
    } catch (error) {
        console.log(`Error sending password reset email`, error)
        throw new Error(`Error sending password reset email: ${error}`)
    }
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail }