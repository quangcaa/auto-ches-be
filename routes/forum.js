const express = require('express')
const router = express.Router()

const ForumController = require('../controllers/ForumController')
const isAuth = require('../middlewares/isAuth')

router.get('/', ForumController.getAllCategory)
router.post('/create-topic', ForumController.createTopic)
router.get('/:category_name', ForumController.getAllTopic)
router.get('/:category_name/:topic_id', ForumController.getTopicById)
router.post('/:category_name/:topic_id/create-post', ForumController.createPost)

module.exports = router