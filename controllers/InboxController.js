const { sequelize, User, Passwordreset } = require('../db/models')
const { Op } = require('sequelize')

class InboxController {
    // @route GET /inbox
    // @desc get all inbox
    // @access Private
    async getAllInbox(req, res) {

    }

}

module.exports = new InboxController()