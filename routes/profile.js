const express = require('express');
const router = express.Router();

const ProfileController = require('../controllers/ProfileController');

router.get('/profiles', ProfileController.getUserProfileById);
router.put('/profiles', ProfileController.updateUserProfile);

module.exports = router;