import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import './LifestylePage.css';

const LifestylePage = () => {
  // 文章數據
  const [lifestyleArticles, setLifestyleArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 從服務器獲取生活方式類別文章
  useEffect(() => {
    const fetchLifestyleArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles/category/lifestyle');
        const data = await response.json();
        
        if (response.ok) {
          console.log('獲取生活方式文章成功:', JSON.stringify(data.data, null, 2));
          if (data.data && Array.isArray(data.data)) {
            setLifestyleArticles(data.data);
          } else {
            setLifestyleArticles([]);
            console.error('API返回的數據格式不正確', data);
          }
          setError(null);
        } else {
          throw new Error(data.message || '無法獲取生活方式文章');
        }
      } catch (err) {
        console.error('獲取生活方式文章出錯:', err);
        setError(err.message || '獲取文章失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchLifestyleArticles();
  }, []);

  // 格式化閱讀量
  const formatViews = (views) => {
    if (!views && views !== 0) return '0';
    
    if (views >= 10000) {
      return `${Math.floor(views / 10000)}萬`;
    }
    if (views >= 1000) {
      return `${Math.floor(views / 1000)}千`;
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

  // 頁碼控制
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  
  const totalPages = Math.ceil(lifestyleArticles.length / articlesPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // 當前頁的文章
  const currentArticles = lifestyleArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="lifestyle-page">
      <Header />
      
      <div className="lifestyle-content container">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <span className="separator">/</span>
          <span className="current">生活方式</span>
        </div>
        
        <div className="ad-space">
          {/* 廣告位置 */}
        </div>
        
        <div className="page-title-container">
          <h1 className="page-title">
            <span>生活方式</span>
          </h1>
          
          <div className="share-buttons">
            <a href="#" className="share-btn facebook">
              <i className="icon-facebook"></i>
            </a>
            <a href="#" className="share-btn line">
              <i className="icon-line"></i>
            </a>
          </div>
        </div>
        
        {loading ? (
          <div className="loading-container">加載中...</div>
        ) : error ? (
          <div className="error-container">{error}</div>
        ) : lifestyleArticles.length === 0 ? (
          <div className="empty-message">暫無生活方式文章</div>
        ) : (
          <ul className="lifestyle-articles">
            {currentArticles.map((article) => (
              <li key={article.id} className="article-item">
                <div className="article-thumb">
                  <div className="article-date-overlay">
                    {article.created_at ? formatDate(article.created_at) : article.date || '無日期'}
                  </div>
                  <Link to={`/article/${article.id}`}>
                    {article.image_url ? (
                      <img
                        src={getImageUrl(article.image_url)}
                        alt={article.title}
                        className="article-thumb-image"
                        onError={(e) => {
                          console.error('文章圖片載入失敗，路徑:', e.target.src);
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          // 當圖片載入失敗時，使用備用圖片
                          const container = e.target.parentElement;
                          const fallbackImg = document.createElement('img');
                          fallbackImg.src = 'https://images.unsplash.com/photo-1513694203232-719a280e022f';
                          fallbackImg.alt = article.title;
                          fallbackImg.className = 'article-thumb-image';
                          container.appendChild(fallbackImg);
                        }}
                      />
                    ) : (
                      <img
                        className="article-thumb-image"
                        src="https://images.unsplash.com/photo-1513694203232-719a280e022f"
                        alt={article.title}
                      />
                    )}
                  </Link>
                </div>
                
                <div className="article-info">
                  <Link to={`/article/${article.id}`} className="article-title-link">
                    <h2 className="article-title">{article.title}</h2>
                  </Link>
                  
                  <ul className="article-meta">
                    <li className="article-views">
                      <i className="icon-view"></i> {formatViews(article.views)}
                    </li>
                  </ul>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {totalPages > 1 && (
          <div className="pagination">
            {currentPage > 1 && (
              <span 
                className="pagination-arrow prev" 
                onClick={() => handlePageChange(currentPage - 1)}
              >
                上一頁
              </span>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <span
                key={page}
                className={`pagination-number ${page === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </span>
            ))}
            
            {currentPage < totalPages && (
              <span 
                className="pagination-arrow next" 
                onClick={() => handlePageChange(currentPage + 1)}
              >
                下一頁
              </span>
            )}
            
            <span 
              className="pagination-arrow last" 
              onClick={() => handlePageChange(totalPages)}
            >
              最後一頁
            </span>
          </div>
        )}
        
      </div>
      
      <Footer />
    </div>
  );
};

export default LifestylePage; 