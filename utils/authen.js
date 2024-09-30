const jwt = require('jsonwebtoken')
const promisify = require('util').promisify

const sign = promisify(jwt.sign).bind(jwt)
const verify = promisify(jwt.verify).bind(jwt)

const generateToken = async (payload, secretSignature, tokenLife) => {
    try {
        return await sign(
            {
                payload
            },
            secretSignature,
            {
                algorithm: 'HS256',
                expiresIn: tokenLife,
            }
        )
    } catch (error) {
        console.log(`Error in generate token: ${error}`)
        return null
    }
}

const decodeToken = async (token, secretKey) => {
    try {
        return await verify(token, secretKey, {
            ignoreExpiration: true
        })
    } catch (error) {
        console.log(`Error in decode token token: ${error}`)
        return null
    }
}

const verifyToken = async (token, secretKey) => {
    try {
        return await verify(token, secretKey)
    } catch (error) {
        console.log(`Error in verify token token: ${error}`)
        return null
    }
}

module.exports = { generateToken, decodeToken, verifyToken }