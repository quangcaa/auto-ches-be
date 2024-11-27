const express = require('express')
const router = express.Router()

const GameController = require('../controllers/GameController')
const isAuth = require('../middlewares/isAuth')

router.post('/create-computer', GameController.createComputerGame)

module.exports = router