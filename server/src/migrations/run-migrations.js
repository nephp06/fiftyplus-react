const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');

async function runMigrations() {
  try {
    // 确保数据库连接
    await sequelize.authenticate();
    console.log('数据库连接成功');

    // 获取所有迁移文件
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith('.js') && file !== 'run-migrations.js')
      .sort(); // 按文件名排序

    console.log(`找到 ${migrationFiles.length} 个迁移文件`);

    // 运行迁移
    for (const file of migrationFiles) {
      const migration = require(path.join(migrationsDir, file));
      console.log(`运行迁移: ${file}`);

      if (typeof migration.up === 'function') {
        const result = await migration.up();
        if (result) {
          console.log(`迁移 ${file} 成功`);
        } else {
          console.error(`迁移 ${file} 失败`);
          break;
        }
      } else {
        console.warn(`迁移 ${file} 没有 up 方法`);
      }
    }

    console.log('所有迁移已完成');
  } catch (error) {
    console.error('运行迁移时出错:', error);
  } finally {
    // 关闭数据库连接
    await sequelize.close();
  }
}

// 运行迁移
runMigrations();
