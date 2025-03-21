const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { upload, handleUploadError } = require('../middleware/upload');
const authMiddleware = require('../middleware/auth');

// 所有上传路由都需要认证
router.use(authMiddleware);

// 上传图片
router.post(
  '/image',
  upload.single('image'),
  handleUploadError,
  uploadController.uploadImage
);

module.exports = router;
