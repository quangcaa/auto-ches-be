const express = require('express')
const router = express.Router()

const ForumController = require('../controllers/ForumController')
const isAuth = require('../middlewares/isAuth')

router.get('/', isAuth, ForumController.getAllCategory)

router.get('/:category_id', isAuth, ForumController.getTopics)
router.post('/:category_id/create', isAuth, ForumController.createTopic)
router.delete('/t/:topic_id', isAuth, ForumController.deleteTopic)

router.get('/:category_id/:topic_id', isAuth, ForumController.getPosts)
router.post('/:category_id/:topic_id/create', isAuth, ForumController.createPost)
router.delete('/p/:post_id', isAuth, ForumController.deletePost)

module.exports = router