import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { articleApi } from '../../services/api';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import './ArticleListPage.css';

const ArticleListPage = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    search: '',
    page: 1,
    limit: 10
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadArticles();
  }, [filters]);

  const loadArticles = async () => {
    try {
      setLoading(true);
      console.log('正在加载文章列表，过滤条件:', filters);
      
      // 使用管理员API获取文章列表
      const token = localStorage.getItem('token');
      
      // 构建查询参数
      const queryParams = new URLSearchParams();
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.category !== 'all') queryParams.append('category', filters.category);
      if (filters.search) queryParams.append('search', filters.search);
      queryParams.append('page', filters.page);
      queryParams.append('limit', filters.limit);
      
      const response = await fetch(`/api/admin/articles?${queryParams.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误响应:', errorText);
        throw new Error(`API返回错误: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('文章列表数据:', data);
      
      if (data && data.success) {
        setArticles(data.data || []);
        setTotal(data.total || 0);
      } else {
        throw new Error(data.message || '获取文章列表失败');
      }
    } catch (err) {
      console.error('加载文章列表错误:', err);
      setError(`加载文章列表失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // 重置页码
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('确定要删除这篇文章吗？')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误响应:', errorText);
        throw new Error(`API返回错误: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('删除文章响应:', data);
      
      if (data && data.success) {
        loadArticles();
      } else {
        throw new Error(data.message || '删除文章失败');
      }
    } catch (err) {
      console.error('删除文章错误:', err);
      setError(`删除文章失败: ${err.message}`);
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">加载中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="article-list-page">
        <div className="page-header">
          <h1>文章管理</h1>
          <Link to="/admin/articles/new" className="btn-create">
            创建文章
          </Link>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="filters">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="搜索文章..."
              className="search-input"
            />
            <button type="submit" className="btn-search">搜索</button>
          </form>

          <div className="filter-group">
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">所有状态</option>
              <option value="draft">草稿</option>
              <option value="published">已发布</option>
            </select>

            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="all">所有分类</option>
              <option value="news">新闻</option>
              <option value="people">人物</option>
              <option value="culture">文化</option>
              <option value="lifestyle">生活方式</option>
            </select>
          </div>
        </div>

        <div className="article-table">
          <table>
            <thead>
              <tr>
                <th>标题</th>
                <th>分类</th>
                <th>状态</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {articles.length > 0 ? (
                articles.map(article => (
                  <tr key={article.id}>
                    <td>{article.title}</td>
                    <td>{article.category}</td>
                    <td>
                      <span className={`status-badge ${article.status}`}>
                        {article.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td>{formatDate(article.created_at || article.createdAt)}</td>
                    <td className="actions">
                      <button
                        onClick={() => navigate(`/admin/articles/edit/${article.id}`)}
                        className="btn-edit"
                      >
                        编辑
                      </button>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="btn-delete"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">暂无数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page === 1}
            className="btn-page"
          >
            上一页
          </button>
          <span className="page-info">
            第 {filters.page} 页，共 {Math.ceil(total / filters.limit)} 页
          </span>
          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= Math.ceil(total / filters.limit)}
            className="btn-page"
          >
            下一页
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ArticleListPage; 