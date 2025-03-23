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

// 中間件配置
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev')); // 日誌中間件

// 靜態文件服務
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 設置CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  next();
});

// 簡單API測試路由
app.get('/api/test', (req, res) => {
  res.json({ message: '服務器正常運行' });
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

// 其他API路由
app.use('/api', articleRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// 404處理
app.use((req, res) => {
  res.status(404).json({
    message: '請求的資源不存在',
  });
});

// 錯誤處理中間件
app.use((err, req, res, next) => {
  console.error('服務器錯誤:', err);
  res.status(500).json({
    message: '服務器內部錯誤',
  });
});

// 啟動服務器
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('數據庫連接成功');

    // 同步數據庫模型
    await sequelize.sync({ alter: false });
    console.log('數據庫同步完成，保留現有數據');

    // 添加初始用戶和文章數據
    await seedDatabase();

    // 啟動服務器
    const PORT = process.env.PORT || 5003;
    app.listen(PORT, () => {
      console.log(`服務器運行在端口 ${PORT}`);
    });
  } catch (error) {
    console.error('服務器啟動失敗:', error);
  }
};

startServer();

module.exports = app;
