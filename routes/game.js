const express = require('express')
const router = express.Router()

const GameController = require('../controllers/GameController')
const isAuth = require('../middlewares/isAuth')

router.post('/create-computer', isAuth, GameController.createComputerGame)
router.get('/:game_id', isAuth, GameController.getGameById)

module.exports = router