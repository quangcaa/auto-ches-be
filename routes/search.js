const express = require('express')
const router = express.Router()

const SearchController = require('../controllers/SearchController')
const isAuth = require('../middlewares/isAuth')

router.get('/:searchText', isAuth, SearchController.searchUser)

module.exports = router