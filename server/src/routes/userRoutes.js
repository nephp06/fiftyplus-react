const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// 所有用户路由都需要认证
router.use(authMiddleware);

// 获取所有用户
router.get('/', userController.getAllUsers);

// 获取单个用户
router.get('/:id', userController.getUser);

// 创建用户
router.post('/', userController.createUser);

// 更新用户
router.put('/:id', userController.updateUser);

// 删除用户
router.delete('/:id', userController.deleteUser);

module.exports = router;
