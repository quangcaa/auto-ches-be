const express = require('express')
const router = express.Router()

const NewsController = require('../controllers/NewsController')
const isAuth = require('../middlewares/isAuth')

router.get('/', NewsController.getAllNews)

module.exports = router