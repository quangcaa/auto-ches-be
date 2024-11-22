const express = require('express')
const router = express.Router()

const ChallengeController = require('../controllers/ChallengeController')
const isAuth = require('../middlewares/isAuth')

router.get('/', isAuth, ChallengeController.getAllChallenge)

module.exports = router