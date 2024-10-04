const express = require('express')
const router = express.Router()

const LearnController = require('../controllers/LearnController')
const isAuth = require('../middlewares/isAuth')

router.get('/', LearnController.getAllLession)

module.exports = router