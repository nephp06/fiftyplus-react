const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../database.sqlite'),
  logging: console.log,
  define: {
    timestamps: false, // 禁用默认时间戳
    underscored: true, // 使用下划线命名
  },
});

module.exports = sequelize;
