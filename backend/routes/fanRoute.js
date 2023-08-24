const express = require('express');
const router = express.Router();
const util = require('../utils/util');
const fanController = require('../controllers/fanController');

router.post('/:id', [util.authorize_bearer], fanController.addFollow);
router.delete('/:id', [util.authorize_bearer], fanController.deleteFollow);

module.exports = router;
