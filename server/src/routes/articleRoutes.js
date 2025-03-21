const express = require('express');
const router = express.Router();
const articleController = require('../controllers/articleController');

// 获取首页数据
router.get('/homepage', articleController.getHomePageData);

// 获取所有文章
router.get('/articles', articleController.getAllArticles);

// 获取单个文章
router.get('/articles/:id', articleController.getArticle);

// 创建文章
router.post('/articles', articleController.createArticle);

// 更新文章
router.put('/articles/:id', articleController.updateArticle);

// 删除文章
router.delete('/articles/:id', articleController.deleteArticle);

module.exports = router;
