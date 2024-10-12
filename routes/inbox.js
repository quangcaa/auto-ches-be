const express = require('express')
const router = express.Router()

const InboxController = require('../controllers/InboxController')
const isAuth = require('../middlewares/isAuth')

router.get('/', InboxController.getAllInbox)
router.get('/messages/:userId', InboxController.getInboxMessage)

module.exports = router