const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')
const validateSignup = require('../middlewares/validate')
const isAuth = require('../middlewares/isAuth')

router.post('/register', validateSignup, AuthController.register)
router.post('/verify-email', isAuth, AuthController.verifyEmail)
router.post('/login', AuthController.login)
router.post('/refresh', AuthController.refreshToken)
router.post('/logout', AuthController.logout)
router.post('/forgot-password', AuthController.forgotPassword)
router.post('/reset-password/:token', AuthController.resetPassword)

router.get('/me', isAuth, (req, res) => {
	res.send({
		success: true,
		user_id: req.user_id,
	})
})

module.exports = router