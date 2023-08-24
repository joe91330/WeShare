const express = require('express');
const multer = require('multer');
const router = express.Router();
const util = require('../utils/util');
const itemController = require('../controllers/itemController');
const path = require('path');

// SET STORAGE
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'static');
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname )
    }
})

const upload = multer({
    storage: storage,
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB
    }
  });

router.post('/', [util.authorize_json, util.authorize_bearer], itemController.addItem);
router.post('/image', upload.single('picture'), [util.authorize_multipart, util.authorize_bearer], itemController.addItemImage);
router.get('/buy', [util.authorize_bearer], itemController.getBuyItems);
router.get('/:id', [util.authorize_bearer], itemController.getItem);
router.get('/', [util.authorize_bearer], itemController.getItems);
router.put('/:id', [util.authorize_json, util.authorize_bearer], itemController.updateItem);
router.put('/:id/image', upload.single('picture'), [util.authorize_multipart, util.authorize_bearer], itemController.updateItemImage);

module.exports = router;

