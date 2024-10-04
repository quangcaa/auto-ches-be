const { sequelize, User, Passwordreset } = require('../db/models')
const { Op } = require('sequelize')

class NewsController {
    // @route GET /news
    // @desc 
    // @access Private
    async getAllNews(req, res) {

    }

}

module.exports = new NewsController()