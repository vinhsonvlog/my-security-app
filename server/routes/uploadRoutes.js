const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { uploadImages, deleteImage } = require('../controllers/uploadController');

// Upload routes
router.post('/', upload.array('images', 5), uploadImages);
router.delete('/', deleteImage);

module.exports = router;
