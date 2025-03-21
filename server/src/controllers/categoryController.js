const { Category, Article } = require('../models');
const { Op } = require('sequelize');

// 获取所有分类
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['id', 'ASC']],
    });

    // 获取每个分类的文章数量
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Article.count({
          where: { category: category.name },
        });

        return {
          ...category.toJSON(),
          articleCount: count,
        };
      })
    );

    return res.json({
      success: true,
      data: categoriesWithCount,
    });
  } catch (error) {
    console.error('获取分类列表失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取分类列表失败',
      error: error.message,
    });
  }
};

// 获取单个分类
exports.getCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      });
    }

    // 获取该分类的文章数量
    const articleCount = await Article.count({
      where: { category: category.name },
    });

    return res.json({
      success: true,
      data: {
        ...category.toJSON(),
        articleCount,
      },
    });
  } catch (error) {
    console.error('获取分类失败:', error);
    return res.status(500).json({
      success: false,
      message: '获取分类失败',
      error: error.message,
    });
  }
};

// 创建分类
exports.createCategory = async (req, res) => {
  const { name, displayName, description } = req.body;

  if (!name || !displayName) {
    return res.status(400).json({
      success: false,
      message: '分类名称和显示名称不能为空',
    });
  }

  try {
    // 检查分类是否已存在
    const existingCategory = await Category.findOne({
      where: { name },
    });

    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: '该分类名称已存在',
      });
    }

    // 创建新分类
    const newCategory = await Category.create({
      name,
      displayName,
      description,
      created_at: new Date(),
    });

    return res.status(201).json({
      success: true,
      message: '分类创建成功',
      data: newCategory,
    });
  } catch (error) {
    console.error('创建分类失败:', error);
    return res.status(500).json({
      success: false,
      message: '创建分类失败',
      error: error.message,
    });
  }
};

// 更新分类
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, displayName, description } = req.body;

  if (!name && !displayName && !description) {
    return res.status(400).json({
      success: false,
      message: '至少需要更新一个字段',
    });
  }

  try {
    // 查找分类
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      });
    }

    // 如果更新名称，检查是否与其他分类重复
    if (name && name !== category.name) {
      const existingCategory = await Category.findOne({
        where: {
          name,
          id: { [Op.ne]: id },
        },
      });

      if (existingCategory) {
        return res.status(400).json({
          success: false,
          message: '该分类名称已存在',
        });
      }

      // 如果更新分类名称，同时更新文章中的分类
      await Article.update(
        { category: name },
        { where: { category: category.name } }
      );
    }

    // 更新分类
    const updateData = {};
    if (name) updateData.name = name;
    if (displayName) updateData.displayName = displayName;
    if (description) updateData.description = description;
    updateData.updated_at = new Date();

    await category.update(updateData);

    return res.json({
      success: true,
      message: '分类更新成功',
      data: await category.reload(),
    });
  } catch (error) {
    console.error('更新分类失败:', error);
    return res.status(500).json({
      success: false,
      message: '更新分类失败',
      error: error.message,
    });
  }
};

// 删除分类
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // 查找分类
    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: '分类不存在',
      });
    }

    // 检查该分类是否有关联的文章
    const articleCount = await Article.count({
      where: { category: category.name },
    });

    if (articleCount > 0) {
      return res.status(400).json({
        success: false,
        message: `无法删除此分类，该分类下有 ${articleCount} 篇文章`,
      });
    }

    // 删除分类
    await category.destroy();

    return res.json({
      success: true,
      message: '分类删除成功',
    });
  } catch (error) {
    console.error('删除分类失败:', error);
    return res.status(500).json({
      success: false,
      message: '删除分类失败',
      error: error.message,
    });
  }
};
