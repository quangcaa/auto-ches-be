const express = require('express');
const router = express.Router();

const FriendshipController = require('../controllers/FriendshipController');

// Route để gửi yêu cầu kết bạn
router.post('/bio', FriendshipController.sendFriendRequest);

// Route để chấp nhận yêu cầu kết bạn
router.put('/bio', FriendshipController.acceptFriendRequest);

// Route để từ chối yêu cầu kết bạn
router.delete('/bio', FriendshipController.declineFriendRequest);

module.exports = router;