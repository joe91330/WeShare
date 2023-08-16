const express = require('express');
const router = express.Router();
const util = require('../utils/util');
const eventController = require('../controllers/eventController');

router.get('/', [util.authorize_bearer], eventController);

module.exports = router;
