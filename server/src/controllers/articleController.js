const { Op } = require('sequelize');
const Article = require('../models/Article');

// 格式化文章数据
const formatArticle = (article) => {
  if (!article) return null;

  // 如果是Sequelize模型实例，转换为普通对象
  const data = article.toJSON ? article.toJSON() : article;

  return {
    id: data.id,
    title: data.title,
    content: data.content || '',
    summary: data.summary || '',
    tags: Array.isArray(data.tags)
      ? data.tags
      : data.tags
      ? data.tags.split(',')
      : [],
    category: data.category,
    imageCategory: data.image_category || 'article',
    image_category: data.image_category || 'article',
    author: data.author,
    photographer: data.photographer || '編輯部',
    editor: data.editor || '編輯部',
    date: new Date(data.created_at).toLocaleDateString('zh-TW'),
    created_at: data.created_at,
    views: data.views || 0,
    status: data.status,
    image_url: data.image_url || '',
  };
};

// 获取所有文章
exports.getAllArticles = async (req, res) => {
  const { page = 1, limit = 10, category, status, search } = req.query;
  const offset = (page - 1) * limit;

  console.log('获取文章列表，参数:', req.query);

  // 检查是否来自管理员路由
  const isAdmin = req.originalUrl.includes('/admin/');

  try {
    // 构建查询条件
    const where = {};

    // 状态过滤
    if (!isAdmin) {
      where.status = 'published';
    } else if (status && status !== 'all') {
      where.status = status;
    }

    // 分类过滤
    if (category && category !== 'all') {
      where.category = category;
    }

    // 搜索过滤
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
      ];
    }

    console.log('查询条件:', where);

    // 获取文章列表
    const { count, rows } = await Article.findAndCountAll({
      where,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: offset,
    });

    console.log(`找到 ${rows.length} 篇文章，总计 ${count} 篇`);

    // 格式化数据
    const result = {
      success: true,
      data: rows.map((article) => ({
        id: article.id,
        title: article.title,
        category: article.category,
        status: article.status || 'draft',
        views: article.views || 0,
        created_at: article.created_at,
        updated_at: article.updated_at,
        image_url: article.image_url,
      })),
      total: count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / limit),
    };

    console.log('返回文章列表结果');
    return res.json(result);
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取文章列表失败',
      error: error.message,
    });
  }
};

// 获取单个文章
exports.getArticle = async (req, res) => {
  const { id } = req.params;
  console.log(`获取文章ID: ${id}`);

  try {
    // 查询文章
    const article = await Article.findOne({
      where: {
        id: id,
        status: 'published',
      },
    });

    if (!article) {
      console.log(`找不到ID为${id}的已发布文章`);
      return res.status(404).json({
        success: false,
        message: '文章不存在',
      });
    }

    // 更新浏览量
    article.views = (article.views || 0) + 1;
    await article.save();

    // 获取相关文章
    const relatedArticles = await Article.findAll({
      where: {
        category: article.category,
        id: { [Op.ne]: id },
        status: 'published',
      },
      attributes: ['id', 'title', 'image_category', 'views', 'image_url'],
      limit: 2,
    });

    const formattedArticle = formatArticle(article);
    formattedArticle.relatedArticles = relatedArticles.map((related) => ({
      id: related.id,
      title: related.title,
      imageCategory: related.image_category || 'article',
      views: related.views || 0,
      image_url: related.image_url || '',
    }));

    console.log('成功获取文章及相关文章');
    return res.json({
      success: true,
      data: formattedArticle,
    });
  } catch (error) {
    console.error('获取文章失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取文章失败',
      error: error.message,
    });
  }
};

// 管理员获取单个文章（不限制状态）
exports.getArticleForAdmin = async (req, res) => {
  const { id } = req.params;
  console.log(`管理员正在获取文章ID: ${id}`);

  try {
    // 查询文章
    const article = await Article.findByPk(id);

    if (!article) {
      console.log(`找不到ID为${id}的文章`);
      return res.status(404).json({
        success: false,
        message: '文章不存在',
      });
    }

    console.log('查询到的文章原始数据:', article.toJSON());

    // 转换为前端需要的格式
    const formattedArticle = {
      id: article.id,
      title: article.title || '',
      content: article.content || '',
      summary: article.summary || '',
      category: article.category || '',
      imageCategory: article.image_category || 'article',
      author: article.author || '',
      photographer: article.photographer || '編輯部',
      editor: article.editor || '編輯部',
      date: article.created_at
        ? new Date(article.created_at).toLocaleDateString('zh-TW')
        : '',
      views: article.views || 0,
      status: article.status || 'draft',
      tags: article.tags || [],
      coverImage: article.image_url || '',
    };

    console.log('发送的格式化文章数据:', formattedArticle);

    return res.json({
      success: true,
      data: formattedArticle,
    });
  } catch (error) {
    console.error('获取文章失败:', error);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误',
      error: error.message,
    });
  }
};

// 创建文章
exports.createArticle = async (req, res) => {
  const {
    title,
    content,
    summary,
    tags,
    category,
    image_url,
    author,
    status = 'draft',
  } = req.body;

  if (!title || !content) {
    return res.status(400).json({
      success: false,
      message: '标题和内容不能为空',
    });
  }

  try {
    // 创建文章
    const newArticle = await Article.create({
      title,
      content,
      summary,
      tags,
      category,
      image_url,
      author,
      status,
      created_at: new Date(),
      views: 0,
    });

    console.log('创建的新文章:', newArticle.toJSON());

    return res.status(201).json({
      success: true,
      message: '文章创建成功',
      data: { id: newArticle.id },
    });
  } catch (error) {
    console.error('创建文章失败:', error);
    return res.status(500).json({
      success: false,
      message: '创建文章失败',
      error: error.message,
    });
  }
};

// 更新文章
exports.updateArticle = async (req, res) => {
  const { id } = req.params;
  const { title, content, summary, tags, category, image_url, status } =
    req.body;

  if (
    !title &&
    !content &&
    !category &&
    !image_url &&
    !status &&
    !summary &&
    !tags
  ) {
    return res.status(400).json({
      success: false,
      message: '至少需要更新一个字段',
    });
  }

  try {
    // 查询文章是否存在
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在',
      });
    }

    // 构建更新数据
    const updateData = {};

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (summary !== undefined) updateData.summary = summary;
    if (tags !== undefined) updateData.tags = tags;
    if (category) updateData.category = category;
    if (image_url) updateData.image_url = image_url;
    if (status) updateData.status = status;

    // 设置更新时间
    updateData.updated_at = new Date();

    console.log('更新文章数据:', updateData);

    // 更新文章
    await article.update(updateData);

    return res.json({
      success: true,
      message: '文章更新成功',
    });
  } catch (error) {
    console.error('更新文章失败:', error);
    return res.status(500).json({
      success: false,
      message: '更新文章失败',
      error: error.message,
    });
  }
};

// 删除文章
exports.deleteArticle = async (req, res) => {
  const { id } = req.params;

  try {
    // 查询文章是否存在
    const article = await Article.findByPk(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        message: '文章不存在',
      });
    }

    // 删除文章
    await article.destroy();

    return res.json({
      success: true,
      message: '文章删除成功',
    });
  } catch (error) {
    console.error('删除文章失败:', error);
    return res.status(500).json({
      success: false,
      message: '删除文章失败',
      error: error.message,
    });
  }
};

// 获取首页数据
exports.getHomePageData = async (req, res) => {
  try {
    // 获取热门文章
    const hotArticles = await Article.findAll({
      where: { status: 'published' },
      order: [['views', 'DESC']],
      limit: 5,
    });

    // 获取人物类别文章
    const peopleArticles = await Article.findAll({
      where: {
        category: 'people',
        status: 'published',
      },
      order: [['created_at', 'DESC']],
      limit: 3,
    });

    // 获取心灵类别文章
    const mindArticles = await Article.findAll({
      where: {
        category: 'mind',
        status: 'published',
      },
      order: [['created_at', 'DESC']],
      limit: 3,
    });

    // 获取健康类别文章
    const healthArticles = await Article.findAll({
      where: {
        category: 'health',
        status: 'published',
      },
      order: [['created_at', 'DESC']],
      limit: 3,
    });

    // 获取生活类别文章
    const lifestyleArticles = await Article.findAll({
      where: {
        category: 'lifestyle',
        status: 'published',
      },
      order: [['created_at', 'DESC']],
      limit: 3,
    });

    // 获取财经类别文章
    const financeArticles = await Article.findAll({
      where: {
        category: 'finance',
        status: 'published',
      },
      order: [['created_at', 'DESC']],
      limit: 3,
    });

    // 获取播客类别文章
    const podcastArticles = await Article.findAll({
      where: {
        category: 'podcast',
        status: 'published',
      },
      order: [['created_at', 'DESC']],
      limit: 3,
    });

    // 格式化并返回数据
    res.json({
      success: true,
      data: {
        hot: hotArticles.map((article, index) => ({
          ...formatArticle(article),
          number: String(index + 1).padStart(2, '0'),
        })),
        people: peopleArticles.map(formatArticle),
        mind: mindArticles.map(formatArticle),
        health: healthArticles.map(formatArticle),
        lifestyle: lifestyleArticles.map(formatArticle),
        finance: financeArticles.map(formatArticle),
        podcast: podcastArticles.map(formatArticle),
      },
    });
  } catch (err) {
    console.error('获取首页数据失败:', err);
    res.status(500).json({
      success: false,
      message: '获取首页数据失败',
      error: err.message,
    });
  }
};

// 獲取特定分類的所有文章
exports.getArticlesByCategory = async (req, res) => {
  const { categoryName } = req.params;
  console.log(`獲取 ${categoryName} 分類的文章`);

  try {
    // 獲取對應分類的所有已發佈文章
    const articles = await Article.findAll({
      where: {
        category: categoryName,
        status: 'published',
      },
      order: [['created_at', 'DESC']],
    });

    // 格式化並返回數據
    const formattedArticles = articles.map(formatArticle);

    console.log(`找到 ${articles.length} 篇 ${categoryName} 分類的文章`);
    return res.json({
      success: true,
      data: formattedArticles,
    });
  } catch (error) {
    console.error(`獲取 ${categoryName} 分類文章失敗:`, error);
    return res.status(500).json({
      success: false,
      message: `獲取 ${categoryName} 分類文章失敗`,
      error: error.message,
    });
  }
};
