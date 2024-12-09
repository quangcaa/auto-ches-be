const express = require('express')
const router = express.Router()

const ChallengeController = require('../controllers/ChallengeController')
const isAuth = require('../middlewares/isAuth')

router.get('/', isAuth, ChallengeController.getAllChallenge)
router.post('/accept/:challenge_id', isAuth, ChallengeController.acceptChallenge)
router.post('/decline/:challenge_id', isAuth, ChallengeController.declineChallenge)

module.exports = router