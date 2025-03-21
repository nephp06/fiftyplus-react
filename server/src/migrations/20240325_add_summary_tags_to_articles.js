const sequelize = require('../config/database');
const { DataTypes, Op } = require('sequelize');
const { QueryTypes } = require('sequelize');

async function up() {
  try {
    const queryInterface = sequelize.getQueryInterface();

    // 获取表结构
    const tableInfo = await sequelize.query('PRAGMA table_info(articles);', {
      type: QueryTypes.SELECT,
    });

    // 检查字段是否存在
    const existingColumns = tableInfo.map((col) => col.name);
    console.log('现有列:', existingColumns);

    // 添加summary字段（如果不存在）
    if (!existingColumns.includes('summary')) {
      console.log('添加 summary 字段...');
      await queryInterface.addColumn('articles', 'summary', {
        type: DataTypes.TEXT,
        allowNull: true,
      });
      console.log('summary 字段添加成功');
    } else {
      console.log('summary 字段已存在，跳过');
    }

    // 添加tags字段（如果不存在）
    if (!existingColumns.includes('tags')) {
      console.log('添加 tags 字段...');
      await queryInterface.addColumn('articles', 'tags', {
        type: DataTypes.STRING,
        allowNull: true,
      });
      console.log('tags 字段添加成功');
    } else {
      console.log('tags 字段已存在，跳过');
    }

    console.log('获取所有文章，检查是否需要提取摘要');
    // 从现有文章的content中提取摘要
    const Article = require('../models/Article');
    const articles = await Article.findAll();

    let extractedCount = 0;
    for (const article of articles) {
      let content = article.content || '';

      // 跳过没有摘要标记或已有摘要的文章
      if (
        !content.includes('<div class="article-summary">') ||
        article.summary
      ) {
        continue;
      }

      let summary = '';

      // 尝试从content中提取摘要
      const summaryMatch = content.match(
        /<div class="article-summary">(.*?)<\/div>/
      );
      if (summaryMatch && summaryMatch[1]) {
        summary = summaryMatch[1];
        // 从content中移除摘要部分
        content = content.replace(
          /<div class="article-summary">.*?<\/div>/,
          ''
        );

        // 更新文章
        await article.update({
          content: content,
          summary: summary,
        });

        extractedCount++;
      }
    }

    console.log(`已从 ${extractedCount} 篇文章中提取摘要`);

    return true;
  } catch (error) {
    console.error('迁移失败:', error);
    return false;
  }
}

async function down() {
  // 因为字段可能已存在，所以不执行回滚操作
  console.log('跳过回滚操作，因为字段可能已被其他进程使用');
  return true;
}

module.exports = { up, down };
