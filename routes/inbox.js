const express = require('express')
const router = express.Router()

const InboxController = require('../controllers/InboxController')
const isAuth = require('../middlewares/isAuth')

router.get('/', isAuth, InboxController.getAllInbox)
router.get('/:userId', isAuth, InboxController.getInboxMessage)
router.delete('/delete-inbox/:userId', isAuth, InboxController.deleteInbox)
router.post('/send-message/:userId', isAuth, InboxController.sendMessage)

module.exports = router