const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')
const validateSignup = require('../middlewares/validate')

router.post('/signup', validateSignup, AuthController.signup)
router.post('/verify-email', AuthController.verifyEmail)
router.post('/login', AuthController.login)
router.post('/logout', AuthController.logout)

module.exports = router