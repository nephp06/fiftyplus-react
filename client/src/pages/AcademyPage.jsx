import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import UnsplashImage from '../components/UnsplashImage.jsx';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import './AcademyPage.css';

const AcademyPage = () => {
  // 文章数据
  const [academyArticles, setAcademyArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 从服务器获取学院类别文章
  useEffect(() => {
    const fetchAcademyArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles/category/academy');
        const data = await response.json();
        
        if (response.ok) {
          console.log('獲取學院文章成功:', data);
          if (data.data && Array.isArray(data.data)) {
            setAcademyArticles(data.data);
          } else {
            setAcademyArticles([]);
            console.error('API返回的數據格式不正確', data);
          }
          setError(null);
        } else {
          throw new Error(data.message || '無法獲取學院文章');
        }
      } catch (err) {
        console.error('獲取學院文章出錯:', err);
        setError(err.message || '獲取文章失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchAcademyArticles();
  }, []);

  // 格式化阅读量
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
      return `${month}月 ${day},${year}`;
    } catch (e) {
      console.error('日期格式化錯誤:', e);
      return '無日期';
    }
  };

  // 页码控制
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  
  const totalPages = Math.ceil(academyArticles.length / articlesPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // 当前页的文章
  const currentArticles = academyArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="academy-page">
      <Header />
      
      <div className="academy-content container">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <span className="separator">/</span>
          <span className="current">學院</span>
        </div>
        
        <div className="ad-space">
          {/* 广告位置 */}
        </div>
        
        <div className="page-title-container">
          <h1 className="page-title">
            <span>學院</span>
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
        ) : academyArticles.length === 0 ? (
          <div className="empty-message">暫無學院文章</div>
        ) : (
          <ul className="academy-articles">
            {currentArticles.map((article) => (
              <li key={article.id} className="article-item">
                <div className="article-thumb">
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
                          // 當圖片載入失敗時，使用UnsplashImage作為後備
                          const container = e.target.parentElement;
                          const unsplashImg = document.createElement('div');
                          container.appendChild(unsplashImg);
                          // 這裡我們需要使用React的方式來渲染UnsplashImage組件
                          ReactDOM.render(
                            <UnsplashImage
                              category={article.image_category || 'education,academy'}
                              width={350}
                              height={240}
                              alt={article.title}
                            />,
                            unsplashImg
                          );
                        }}
                      />
                    ) : (
                      <UnsplashImage 
                        category={article.image_category || article.imageCategory || 'education,academy'} 
                        width={350} 
                        height={240} 
                        alt={article.title} 
                      />
                    )}
                  </Link>
                </div>
                
                <div className="article-info">
                  <div className="article-date">
                    {article.created_at ? formatDate(article.created_at) : article.date || '無日期'}
                  </div>
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

export default AcademyPage; 