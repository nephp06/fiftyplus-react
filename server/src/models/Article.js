const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Article = sequelize.define(
  'Article',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    summary: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
      get() {
        const value = this.getDataValue('tags');
        return value ? value.split(',') : [];
      },
      set(val) {
        if (Array.isArray(val)) {
          this.setDataValue('tags', val.join(','));
        } else {
          this.setDataValue('tags', val);
        }
      },
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image_category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'published',
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'articles',
    timestamps: false,
  }
);

module.exports = Article;
