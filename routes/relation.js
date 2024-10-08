const express = require('express')
const router = express.Router()

const RelationController = require('../controllers/RelationController')
const isAuth = require('../middlewares/isAuth')

router.post('/follow/:username', isAuth, RelationController.follow)
router.delete('/unfollow/:username', isAuth, RelationController.unfollow)

module.exports = router