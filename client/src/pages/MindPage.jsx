import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import './MindPage.css';

const MindPage = () => {
  // 文章數據狀態
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 分頁狀態
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const articlesPerPage = 5; // 每頁顯示5篇文章
  
  // 格式化觀看次數
  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };
  
  // 格式化日期
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '無日期';
      }
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month}月 ${day}, ${year}`;
    } catch (e) {
      console.error('日期格式化錯誤:', e);
      return '無日期';
    }
  };
  
  // 獲取心靈類別文章
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/articles/category/mind');
        const data = await response.json();
        
        if (response.ok) {
          setArticles(data.data);
          console.log('心靈文章數據:', JSON.stringify(data.data, null, 2)); // 詳細輸出數據結構
          // 計算總頁數
          setTotalPages(Math.ceil(data.data.length / articlesPerPage));
        } else {
          setError('獲取文章失敗');
        }
      } catch (err) {
        console.error('獲取文章錯誤:', err);
        setError('獲取文章時發生錯誤');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticles();
  }, []);
  
  // 當前頁的文章
  const currentArticles = articles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );
  
  // 頁面變更處理
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };
  
  // 生成分頁按鈕
  const renderPagination = () => {
    const pages = [];
    
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <div
          key={i}
          className={`pagination-number ${currentPage === i ? 'active' : ''}`}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </div>
      );
    }
    
    return (
      <div className="pagination">
        {currentPage > 1 && (
          <div className="pagination-arrow" onClick={() => handlePageChange(currentPage - 1)}>
            &lt;
          </div>
        )}
        {pages}
        {currentPage < totalPages && (
          <div className="pagination-arrow" onClick={() => handlePageChange(currentPage + 1)}>
            &gt;
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="mind-page">
      <Header />
      <div className="container">
        <div className="mind-content">
          {/* 面包屑导航 */}
          <div className="breadcrumb">
            <Link to="/">首頁</Link>
            <span className="separator">/</span>
            <span className="current">心靈</span>
          </div>
          
          {/* 广告位 */}
          <div className="ad-space">
            <span>廣告區塊</span>
          </div>
          
          {/* 页面标题 */}
          <div className="page-title-container">
            <h1 className="page-title">心<span>靈</span></h1>
            <div className="share-buttons">
              <div className="share-btn">
                <i className="fa fa-facebook"></i>
              </div>
              <div className="share-btn">
                <i className="fa fa-twitter"></i>
              </div>
              <div className="share-btn">
                <i className="fa fa-envelope"></i>
              </div>
            </div>
          </div>
          
          {/* 文章列表 */}
          {loading ? (
            <div className="loading-container">正在加載文章...</div>
          ) : error ? (
            <div className="error-container">{error}</div>
          ) : currentArticles.length === 0 ? (
            <div className="empty-message">暫無相關文章</div>
          ) : (
            <div className="mind-articles">
              {currentArticles.map((article) => (
                <div className="article-item" key={article.id}>
                  <div className="article-thumb">
                    <div className="article-date-overlay">
                      {formatDate(article.published_at || article.created_at)}
                    </div>
                    <Link to={`/article/${article.id}`}>
                      {article.image_url ? (
                        <img
                          className="article-thumb-image"
                          src={article.image_url}
                          alt={article.title}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const container = e.target.parentElement;
                            // 創建一個備用的圖片元素
                            const fallbackImg = document.createElement('img');
                            fallbackImg.src = 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81';
                            fallbackImg.alt = article.title;
                            fallbackImg.className = 'article-thumb-image';
                            container.appendChild(fallbackImg);
                          }}
                        />
                      ) : (
                        <img
                          className="article-thumb-image"
                          src="https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81"
                          alt={article.title}
                        />
                      )}
                    </Link>
                  </div>
                  <div className="article-info">
                    <Link to={`/article/${article.id}`} className="article-title-link">
                      <h2 className="article-title">{article.title}</h2>
                    </Link>
                    <div className="article-meta">
                      <div className="article-views">
                        <i className="fa fa-eye"></i> {formatViews(article.views || 0)} 次閱讀
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* 分页 */}
          {!loading && !error && articles.length > 0 && renderPagination()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MindPage; 