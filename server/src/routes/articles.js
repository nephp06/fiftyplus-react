const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');
const authMiddleware = require('../middleware/auth');

// 公开路由
router.get('/', articleController.getAllArticles);
router.get('/:id', articleController.getArticle);

// 需要认证的路由
router.post('/', authMiddleware, articleController.createArticle);
router.put('/:id', authMiddleware, articleController.updateArticle);
router.delete('/:id', authMiddleware, articleController.deleteArticle);

module.exports = router;
