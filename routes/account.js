const express = require('express')
const router = express.Router()

const AccountController = require('../controllers/AccountController')
const isAuth = require('../middlewares/isAuth')

router.get('/my-profile', isAuth, AccountController.getMyProfile)
router.put('/edit-profile', isAuth, AccountController.editProfile)
router.post('/change-username', isAuth, AccountController.changeUsername)
router.post('/change-password', isAuth, AccountController.changePassword)
router.post('/change-email', isAuth, AccountController.changeEmail)
router.delete('/close-account', isAuth, AccountController.closeAccount)

module.exports = router