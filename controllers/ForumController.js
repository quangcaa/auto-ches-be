const { sequelize, User, Passwordreset } = require('../db/models')
const { Op } = require('sequelize')

class ForumController {
    // @route GET /forum
    // @desc get all forum category
    // @access Private
    async getAllCategory(req, res) {

    }

    // @route POST /forum/post
    // @desc create post in topic  
    // @access Private
    async createTopic(req, res) {

    }


    // @route GET /forum/:category_name
    // @desc get all topic of that category
    // @access Private
    async getAllTopic(req, res) {

    }

    // @route GET /forum/:category_name/:topic_id
    // @desc get topic by id
    // @access Private
    async getTopicById(req, res) {

    }

    // @route POST /forum/:category_name/:topic_id/post
    // @desc create post in topic  
    // @access Private
    async createPost(req, res) {

    }

}

module.exports = new ForumController()