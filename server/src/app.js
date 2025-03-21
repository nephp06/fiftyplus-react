const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { Op } = require('sequelize');
const articleRoutes = require('./routes/articleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const userRoutes = require('./routes/userRoutes');
const uploadRoutes = require('./routes/upload');
const sequelize = require('./config/database');
const seedDatabase = require('./config/seedData');

const app = express();

// 中间件配置
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // 日志中间件

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 设置CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// 简单API测试路由
app.get('/api/test', (req, res) => {
  res.json({ message: '服务器正常运行' });
});

// 健康檢查API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: 'connected',
    uptime: process.uptime(),
  });
});

// 简化的首页API
app.get('/api/homepage', (req, res) => {
  console.log('正在处理 /api/homepage 请求');

  // 超级简化的测试数据
  const data = {
    people: [
      {
        id: 1,
        title: '人物文章1',
        content: '这是人物文章1的内容',
        category: 'people',
        image_url:
          'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
        image_category: 'person',
        views: 100,
        created_at: '2023-01-01',
      },
      {
        id: 2,
        title: '人物文章2',
        content: '这是人物文章2的内容',
        category: 'people',
        image_url:
          'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
        image_category: 'person',
        views: 200,
        created_at: '2023-01-02',
      },
    ],
    hot: [
      {
        id: 3,
        title: '热门文章1',
        content: '这是热门文章1的内容',
        category: 'hot',
        image_url:
          'https://images.unsplash.com/photo-1501854140801-50d01698950b',
        image_category: 'nature',
        views: 300,
        created_at: '2023-01-03',
      },
      {
        id: 4,
        title: '热门文章2',
        content: '这是热门文章2的内容',
        category: 'hot',
        image_url:
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
        image_category: 'nature',
        views: 400,
        created_at: '2023-01-04',
      },
    ],
  };

  // 输出响应前的数据内容
  console.log('返回数据成功');

  // 直接响应
  res.json(data);
});

// 其他API路由
app.use('/api', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// 404处理
app.use((req, res) => {
  res.status(404).json({
    message: '请求的资源不存在',
  });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('服务器错误:', err);
  res.status(500).json({
    message: '服务器内部错误',
  });
});

// 启动服务器
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 同步数据库模型
    await sequelize.sync({ alter: false });
    console.log('數據庫同步完成，保留現有數據');

    // 添加初始用户和文章数据
    await seedDatabase();

    // 启动服务器
    const PORT = process.env.PORT || 5003;
    app.listen(PORT, () => {
      console.log(`服务器运行在端口 ${PORT}`);
    });
  } catch (error) {
    console.error('服务器启动失败:', error);
  }
};

startServer();

module.exports = app;
