const express = require('express')
const router = express.Router()

const AuthController = require('../controllers/AuthController')

router.get('/signup', AuthController.signup)

module.exports = router