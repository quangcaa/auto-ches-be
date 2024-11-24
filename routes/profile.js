const express = require('express')
const router = express.Router()

const ProfileController = require('../controllers/ProfileController')
const isAuth = require('../middlewares/isAuth')

router.get('/:username', isAuth, ProfileController.getUserProfile)
router.get('/:user_id/public', isAuth, ProfileController.getUserPublic)
router.get('/:username/following', isAuth, ProfileController.getAllFollowing)
router.get('/:username/follower', isAuth, ProfileController.getAllFollower)
router.post('/:username/report', isAuth, ProfileController.reportUser)
router.post('/:username/challenge', isAuth, ProfileController.challengeUser)

module.exports = router