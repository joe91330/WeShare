const express = require('express')
const multer = require('multer');
const app = express()
const router = express.Router();
const userController = require('../controllers/userController');
const util = require('../utils/util')
const path = require('path');

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
      fileSize: 5 * 1024 * 1024 // 1MB
    }
  });

router.post('/signin', [util.authorize_json], userController.signin);
router.post('/signup', [util.authorize_json], userController.signup);
router.post('/:id/rating', [util.authorize_json,util.authorize_bearer], userController.giveRating);

router.put('/', [util.authorize_json,util.authorize_bearer], userController.updateProfileName);
router.post('/image', upload.single('picture'), [util.authorize_multipart,util.authorize_bearer], userController.updateProfilePic);

router.get('/:id', [util.authorize_bearer], userController.getProfile);

router.post('/addTest', userController.addTest)


module.exports = router;

