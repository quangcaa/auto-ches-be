const express = require('express')
const router = express.Router()

const ReportController = require('../controllers/ReportController')
const isAuth = require('../middlewares/isAuth')

router.get('/', isAuth, ReportController.getAllReport)

module.exports = router