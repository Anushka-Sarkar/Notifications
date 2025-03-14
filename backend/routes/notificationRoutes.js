const express = require('express');
const router = express.Router();
const { getNotifications } = require('../controllers/notificationController');

// Get all task-related notifications (Pending/In Progress)
router.get('/notifications', getNotifications);

module.exports = router;

