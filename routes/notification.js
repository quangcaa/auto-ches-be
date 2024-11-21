const express = require('express')
const router = express.Router()

const NotificationController = require('../controllers/NotificationController')
const isAuth = require('../middlewares/isAuth')

router.get('/', isAuth, NotificationController.getAllNotification)
router.patch('/mark-read/:notification_id', isAuth, NotificationController.markReadSpecificNotification)
router.patch('/mark-all-read', isAuth, NotificationController.markAllReadNotification)
router.delete('/', isAuth, NotificationController.deleteAllNotification)

module.exports = router