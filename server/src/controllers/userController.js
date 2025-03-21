const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    // 排除密码字段
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['id', 'ASC']],
    });

    return res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('获取用户列表失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取用户列表失败',
      error: error.message,
    });
  }
};

// 获取单个用户
exports.getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('获取用户失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取用户失败',
      error: error.message,
    });
  }
};

// 创建用户
exports.createUser = async (req, res) => {
  const { username, email, password, role = 'editor' } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: '用户名、邮箱和密码不能为空',
    });
  }

  try {
    // 检查用户名或邮箱是否已存在
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ username }, { email }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '用户名或邮箱已被使用',
      });
    }

    // 加密密码
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 创建新用户
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      created_at: new Date(),
    });

    // 返回用户信息，但不包括密码
    const { password: _, ...userWithoutPassword } = newUser.toJSON();

    return res.status(201).json({
      success: true,
      message: '用户创建成功',
      data: userWithoutPassword,
    });
  } catch (error) {
    console.error('创建用户失败:', error);
    return res.status(500).json({
      success: false,
      message: '创建用户失败',
      error: error.message,
    });
  }
};

// 更新用户
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role } = req.body;

  if (!username && !email && !password && !role) {
    return res.status(400).json({
      success: false,
      message: '至少需要更新一个字段',
    });
  }

  try {
    // 查找用户
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    // 如果更新用户名或邮箱，检查是否与其他用户重复
    if (
      (username && username !== user.username) ||
      (email && email !== user.email)
    ) {
      const existingUser = await User.findOne({
        where: {
          [Op.and]: [
            { id: { [Op.ne]: id } },
            {
              [Op.or]: [
                ...(username ? [{ username }] : []),
                ...(email ? [{ email }] : []),
              ],
            },
          ],
        },
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: '用户名或邮箱已被使用',
        });
      }
    }

    // 更新用户数据
    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (role) updateData.role = role;

    // 如果更新密码，需要加密
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    updateData.updated_at = new Date();

    await user.update(updateData);

    // 返回更新后的用户信息，但不包括密码
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    return res.json({
      success: true,
      message: '用户更新成功',
      data: updatedUser,
    });
  } catch (error) {
    console.error('更新用户失败:', error);
    return res.status(500).json({
      success: false,
      message: '更新用户失败',
      error: error.message,
    });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // 查找用户
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }

    // 检查是否为管理员账户
    if (user.role === 'admin' && user.username === 'admin') {
      return res.status(400).json({
        success: false,
        message: '不能删除主管理员账户',
      });
    }

    // 删除用户
    await user.destroy();

    return res.json({
      success: true,
      message: '用户删除成功',
    });
  } catch (error) {
    console.error('删除用户失败:', error);
    return res.status(500).json({
      success: false,
      message: '删除用户失败',
      error: error.message,
    });
  }
};

// 添加初始用户数据
exports.seedUsers = async () => {
  try {
    const count = await User.count();

    // 只有在用户表为空时才添加初始数据
    if (count === 0) {
      console.log('正在添加初始用户数据...');

      // 加密密码
      const salt = await bcrypt.genSalt(10);
      const adminPassword = await bcrypt.hash('admin123', salt);
      const editorPassword = await bcrypt.hash('editor123', salt);
      const writerPassword = await bcrypt.hash('writer123', salt);

      // 创建初始用户
      await User.bulkCreate([
        {
          username: 'admin',
          email: 'admin@fiftyplus.com',
          password: adminPassword,
          role: 'admin',
          created_at: new Date('2023-01-01'),
        },
        {
          username: 'editor',
          email: 'editor@fiftyplus.com',
          password: editorPassword,
          role: 'editor',
          created_at: new Date('2023-01-05'),
        },
        {
          username: 'writer',
          email: 'writer@fiftyplus.com',
          password: writerPassword,
          role: 'writer',
          created_at: new Date('2023-02-10'),
        },
      ]);

      console.log('初始用户数据添加成功！');
    }
  } catch (error) {
    console.error('添加初始用户数据失败:', error);
  }
};
