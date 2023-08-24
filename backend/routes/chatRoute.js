const express = require('express')
const router = express.Router();
const chatController = require('../controllers/chatController');
const util = require('../utils/util')

router.get('/:id', [util.authorize_bearer], chatController.getMessage);

router.get('/', [util.authorize_bearer], chatController.getMessagePreview);

router.put('/addTest', chatController.addTest)

module.exports = router;

