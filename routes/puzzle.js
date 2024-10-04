const express = require('express')
const router = express.Router()

const PuzzleController = require('../controllers/PuzzleController')
const isAuth = require('../middlewares/isAuth')

router.get('/training', PuzzleController.playPuzzle)

module.exports = router