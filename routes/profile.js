const express = require('express');
const router = express.Router();

const ProfileController = require('../controllers/ProfileController');

router.get('/bio', ProfileController.getUserProfileById);
router.put('/bio', ProfileController.updateUserProfile);

module.exports = router;