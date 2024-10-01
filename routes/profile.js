const express = require('express');
const router = express.Router();

const ProfileController = require('../controllers/ProfileController');

// Route để lấy thông tin hồ sơ người dùng
router.get('/bio', ProfileController.getUserProfileById);

// Route để cập nhật thông tin hồ sơ người dùng
router.put('/bio/update', ProfileController.updateUserProfile);

// Route để lấy danh sách bạn bè của người dùng
router.get('/friends', ProfileController.getFriend);

// Route để lấy danh sách yêu cầu kết bạn đang chờ xử lý của người dùng
router.get('/pending-requests', ProfileController.getPendingFriendRequests);

// Route để lấy danh sách yêu cầu kết bạn từ người khác gửi đến người dùng
router.get('/invitations', ProfileController.getFriendRequestsFromOthers);

module.exports = router;
