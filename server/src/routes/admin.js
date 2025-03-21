const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/auth');

// 所有管理员路由都需要认证
router.use(authMiddleware);

// 仪表板数据
router.get('/dashboard', adminController.getDashboardData);

// 统计数据
router.get('/stats', adminController.getStats);

// 管理员文章路由
router.get('/articles', articleController.getAllArticles);
router.get('/articles/:id', articleController.getArticleForAdmin);

module.exports = router;
