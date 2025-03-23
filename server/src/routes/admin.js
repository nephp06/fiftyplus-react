const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/auth');

// 所有管理員路由都需要認證
router.use(authMiddleware);

// 儀表板數據
router.get('/dashboard', adminController.getDashboardData);

// 統計數據
router.get('/stats', adminController.getStats);

// 管理員文章路由
router.get('/articles', articleController.getAllArticles);
router.get('/articles/:id', articleController.getArticleForAdmin);

module.exports = router;
