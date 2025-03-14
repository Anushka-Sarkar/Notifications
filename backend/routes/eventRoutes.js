const express = require('express');
const router = express.Router();
const { createEvent, getEventByEventName, updateEvent, deleteEvent } = require('../controllers/eventController');

// 📌 Create an event
router.post('/', createEvent);

// 📌 Get event by event name
router.get('/:eventName', getEventByEventName);

// 📌 Update an event by event name
router.put('/:eventName', updateEvent);

// 📌 Delete an event by event name
router.delete('/:eventName', deleteEvent);

module.exports = router;







