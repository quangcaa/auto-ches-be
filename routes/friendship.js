const express = require('express');
const router = express.Router();

const FriendshipController = require('../controllers/FriendshipController');

// Route to get user's friends
router.get('/friends', FriendshipController.getFriend);

// Route to get pending friend requests
router.get('/pending-requests', FriendshipController.getPendingFriendRequests);

// Route to get received friend requests (friend requests sent by others)
router.get('/friend-invites', FriendshipController.getFriendRequestsFromOthers);

module.exports = router;
