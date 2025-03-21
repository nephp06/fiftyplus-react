const { Article } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

// 获取仪表板数据
exports.getDashboardData = async (req, res) => {
  try {
    // 获取文章统计
    const stats = {
      totalArticles: await Article.count(),
      publishedArticles: await Article.count({
        where: { status: 'published' },
      }),
      draftArticles: await Article.count({
        where: { status: 'draft' },
      }),
      totalViews: (await Article.sum('views')) || 0,
    };

    // 获取最近的文章
    const recentArticles = await Article.findAll({
      attributes: ['id', 'title', 'status', 'views', 'created_at'],
      order: [['created_at', 'DESC']],
      limit: 5,
    });

    res.json({
      success: true,
      data: {
        stats,
        recentArticles,
      },
    });
  } catch (error) {
    console.error('获取仪表板数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取仪表板数据失败',
      error: error.message,
    });
  }
};

// 获取统计数据
exports.getStats = async (req, res) => {
  try {
    const totalArticles = await Article.count();
    const publishedArticles = await Article.count({
      where: { status: 'published' },
    });
    const draftArticles = await Article.count({
      where: { status: 'draft' },
    });
    const totalViews = (await Article.sum('views')) || 0;
    const lastArticle = await Article.findOne({
      order: [['created_at', 'DESC']],
    });

    const stats = {
      totalArticles,
      publishedArticles,
      draftArticles,
      totalViews,
      lastArticleDate: lastArticle ? lastArticle.created_at : null,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('获取统计数据失败:', error);
    res.status(500).json({
      success: false,
      message: '获取统计数据失败',
      error: error.message,
    });
  }
};
