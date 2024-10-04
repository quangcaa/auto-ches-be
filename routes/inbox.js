const express = require('express')
const router = express.Router()

const InboxController = require('../controllers/InboxController')
const isAuth = require('../middlewares/isAuth')

router.get('/', InboxController.getAllInbox)

module.exports = router