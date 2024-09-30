const { sequelize, User } = require('../db/models')

class AuthController {
    async signup(req, res) {
        res.status(200).json({ message: 'Hello' })
    }
}

module.exports = new AuthController()