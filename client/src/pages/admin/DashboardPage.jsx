import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import './DashboardPage.css';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalArticles: 0,
    publishedArticles: 0,
    draftArticles: 0,
    totalViews: 0
  });

  const [recentArticles, setRecentArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        console.log('正在获取仪表板数据...');
        
        // 从localStorage获取token
        const token = localStorage.getItem('token');
        
        // 直接发起请求
        const response = await axios.get('/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('API响应:', response.data);
        
        if (response.data && response.data.success) {
          const { stats, recentArticles } = response.data.data;
          setStats(stats || {});
          setRecentArticles(recentArticles || []);
          setError('');
        } else {
          throw new Error('API返回失败响应');
        }
      } catch (err) {
        console.error('获取仪表板数据失败:', err);
        setError(err.message || '获取数据失败');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="page-header">
          <h1>控制台</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>&times;</button>
          </div>
        )}
        
        {isLoading ? (
          <div className="loading">加载中...</div>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card total">
                <h3>总文章数</h3>
                <div className="stat-value">{stats.totalArticles}</div>
                <Link to="/admin/articles" className="stat-link">查看全部</Link>
              </div>
              
              <div className="stat-card published">
                <h3>已发布文章</h3>
                <div className="stat-value">{stats.publishedArticles}</div>
                <Link to="/admin/articles?status=published" className="stat-link">查看已发布</Link>
              </div>
              
              <div className="stat-card draft">
                <h3>草稿箱</h3>
                <div className="stat-value">{stats.draftArticles}</div>
                <Link to="/admin/articles?status=draft" className="stat-link">查看草稿</Link>
              </div>
              
              <div className="stat-card create">
                <Link to="/admin/articles/new" className="create-link">
                  <span>创建新文章</span>
                </Link>
              </div>
            </div>

            <div className="recent-articles">
              <div className="section-header">
                <h2>最近文章</h2>
                <Link to="/admin/articles" className="view-all">查看全部</Link>
              </div>

              <div className="article-list">
                {recentArticles.map(article => (
                  <div key={article.id} className="article-card">
                    <div className="article-info">
                      <h3>
                        <Link to={`/admin/articles/edit/${article.id}`}>{article.title}</Link>
                      </h3>
                      <div className="article-meta">
                        <span className={`status-badge ${article.status}`}>
                          {article.status === 'published' ? '已发布' : '草稿'}
                        </span>
                        <span>浏览量：{article.views}</span>
                        <span>创建时间：{new Date(article.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="article-actions">
                      <Link to={`/admin/articles/edit/${article.id}`} className="btn-edit">编辑</Link>
                      <Link to={`/article/${article.id}`} className="btn-view" target="_blank">预览</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default DashboardPage; 