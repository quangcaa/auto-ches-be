const { client, sender } = require('./config')
const { VERIFICATION_EMAIL_TEMPLATE } = require('./emailTemplate')

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

module.exports = sendVerificationEmail