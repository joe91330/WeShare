const express = require('express');
const router = express.Router();
const util = require('../utils/util');
const eventController = require('../controllers/eventController');

router.get('/', [util.authorize_bearer], eventController.getEvent);
router.get('/unread', [util.authorize_bearer], eventController.getNumOfEvent);
router.put('/:event_id', [util.authorize_bearer], eventController.readEvent);

module.exports = router;
