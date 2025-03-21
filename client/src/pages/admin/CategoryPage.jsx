import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { categoryApi } from '../../services/api';
import './CategoryPage.css';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newCategory, setNewCategory] = useState({ name: '', displayName: '', description: '' });
  const [editingCategory, setEditingCategory] = useState(null);

  // 加载分类数据
  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll();
      
      if (response && response.success) {
        setCategories(response.data || []);
      } else {
        throw new Error(response.message || '获取分类数据失败');
      }
      
      setError('');
    } catch (err) {
      console.error('加载分类错误:', err);
      setError(`加载分类失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.displayName) {
      setError('分类名称和显示名称不能为空');
      return;
    }

    try {
      setLoading(true);
      const response = await categoryApi.create(newCategory);
      
      if (response && response.success) {
        loadCategories();
        setNewCategory({ name: '', displayName: '', description: '' });
        setError('');
      } else {
        throw new Error(response.message || '创建分类失败');
      }
    } catch (err) {
      console.error('创建分类错误:', err);
      setError(`创建分类失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!editingCategory.name || !editingCategory.displayName) {
      setError('分类名称和显示名称不能为空');
      return;
    }

    try {
      setLoading(true);
      const response = await categoryApi.update(editingCategory.id, editingCategory);
      
      if (response && response.success) {
        loadCategories();
        setEditingCategory(null);
        setError('');
      } else {
        throw new Error(response.message || '更新分类失败');
      }
    } catch (err) {
      console.error('更新分类错误:', err);
      setError(`更新分类失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('确定要删除这个分类吗？相关文章将变为未分类状态。')) {
      return;
    }
    
    try {
      setLoading(true);
      const response = await categoryApi.delete(id);
      
      if (response && response.success) {
        loadCategories();
        setError('');
      } else {
        throw new Error(response.message || '删除分类失败');
      }
    } catch (err) {
      console.error('删除分类错误:', err);
      setError(`删除分类失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (category) => {
    setEditingCategory({...category});
  };

  const cancelEditing = () => {
    setEditingCategory(null);
  };

  const handleEditingChange = (e) => {
    const { name, value } = e.target;
    setEditingCategory({
      ...editingCategory,
      [name]: value
    });
  };

  const handleNewCategoryChange = (e) => {
    const { name, value } = e.target;
    setNewCategory({
      ...newCategory,
      [name]: value
    });
  };

  if (loading && categories.length === 0) {
    return (
      <AdminLayout>
        <div className="loading">加载中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="category-page">
        <div className="page-header">
          <h1>分类管理</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="category-form-container">
          <h2>添加新分类</h2>
          <form onSubmit={handleAddCategory} className="category-form">
            <div className="form-group">
              <label htmlFor="name">分类名称</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newCategory.name}
                onChange={handleNewCategoryChange}
                placeholder="输入分类英文名称"
              />
            </div>
            <div className="form-group">
              <label htmlFor="displayName">显示名称</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={newCategory.displayName}
                onChange={handleNewCategoryChange}
                placeholder="输入分类中文名称"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">分类描述</label>
              <input
                type="text"
                id="description"
                name="description"
                value={newCategory.description}
                onChange={handleNewCategoryChange}
                placeholder="输入分类描述"
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? '添加中...' : '添加分类'}
            </button>
          </form>
        </div>

        <div className="category-list">
          <h2>现有分类</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>名称</th>
                <th>显示名称</th>
                <th>描述</th>
                <th>文章数量</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map(category => (
                  <tr key={category.id}>
                    {editingCategory && editingCategory.id === category.id ? (
                      <>
                        <td>{category.id}</td>
                        <td>
                          <input
                            type="text"
                            name="name"
                            value={editingCategory.name}
                            onChange={handleEditingChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="displayName"
                            value={editingCategory.displayName}
                            onChange={handleEditingChange}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="description"
                            value={editingCategory.description || ''}
                            onChange={handleEditingChange}
                          />
                        </td>
                        <td>{category.articleCount}</td>
                        <td className="actions">
                          <button onClick={handleUpdateCategory} className="btn-save" disabled={loading}>
                            {loading ? '保存中...' : '保存'}
                          </button>
                          <button onClick={cancelEditing} className="btn-cancel" disabled={loading}>
                            取消
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td>{category.displayName}</td>
                        <td>{category.description}</td>
                        <td>{category.articleCount}</td>
                        <td className="actions">
                          <button
                            onClick={() => startEditing(category)}
                            className="btn-edit"
                            disabled={category.articleCount > 0 || loading}
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="btn-delete"
                            disabled={category.articleCount > 0 || loading}
                          >
                            删除
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">暂无分类数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CategoryPage; 