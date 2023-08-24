const express = require('express');
const router = express.Router();
const util = require('../utils/util');
const orderController = require('../controllers/orderController');

router.post('/:item_id', [util.authorize_json, util.authorize_bearer], orderController.addOrder);
router.get('/', [util.authorize_bearer], orderController.getOrders);
router.put('/:order_id/agree', [util.authorize_bearer], orderController.agreeOrder);
router.delete('/:order_id', [util.authorize_bearer], orderController.delOrder);

module.exports = router;
