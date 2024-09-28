const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')
const validateSignup = require('../middlewares/validate')

router.post('/signup', validateSignup, AuthController.signup)
// router.get('/login', AuthController.login)
// router.get('/logout', AuthController.logout)

module.exports = router