const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models'); // 导入User模型
const sequelize = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// 用户注册
exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  if (!username || !password || !email) {
    return res.status(400).json({
      success: false,
      message: '用户名、密码和邮箱都是必需的',
    });
  }

  try {
    // 检查用户名是否已存在
    const existingUser = await User.findOne({ where: { username } });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名已存在',
      });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = await User.create({
      username,
      password: hashedPassword,
      email,
      role: 'admin', // 默认角色为管理员
    });

    // 生成JWT令牌
    const token = jwt.sign(
      { id: newUser.id, username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: '注册成功',
      data: { token },
    });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: err.message,
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名和密码都是必需的',
    });
  }

  try {
    // 查找用户
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
      });
    }

    // 验证密码
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '用户名或密码错误',
      });
    }

    // 生成JWT令牌
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: '登录成功',
      data: { token },
    });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({
      success: false,
      message: '服务器错误',
      error: err.message,
    });
  }
};

// 获取当前用户信息
exports.getCurrentUser = async (req, res) => {
  const { id } = req.user;

  try {
    const user = await User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'role', 'created_at'],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.error('获取用户信息错误:', err);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: err.message,
    });
  }
};
