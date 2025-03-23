import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import UnsplashImage from '../components/UnsplashImage.jsx';
import { Link } from 'react-router-dom';
import { getImageUrl } from '../utils/imageUtils';
import './PodcastPage.css';

const PodcastPage = () => {
  // Podcast 數據
  const [podcastArticles, setPodcastArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 從服務器獲取 Podcast 類別文章
  useEffect(() => {
    const fetchPodcastArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/articles/category/podcast');
        const data = await response.json();
        
        if (response.ok) {
          console.log('獲取 Podcast 文章成功:', data);
          if (data.data && Array.isArray(data.data)) {
            setPodcastArticles(data.data);
          } else {
            setPodcastArticles([]);
            console.error('API返回的數據格式不正確', data);
          }
          setError(null);
        } else {
          throw new Error(data.message || '無法獲取 Podcast 文章');
        }
      } catch (err) {
        console.error('獲取 Podcast 文章出錯:', err);
        setError(err.message || '獲取文章失敗，請稍後再試');
      } finally {
        setLoading(false);
      }
    };

    fetchPodcastArticles();
  }, []);

  // 格式化收聽次數
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

  // 頁碼控制
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  
  const totalPages = Math.ceil(podcastArticles.length / articlesPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // 當前頁的文章
  const currentArticles = podcastArticles.slice(
    (currentPage - 1) * articlesPerPage,
    currentPage * articlesPerPage
  );

  return (
    <div className="podcast-page">
      <Header />
      
      <div className="podcast-content container">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <span className="separator">/</span>
          <span className="current">Podcast</span>
        </div>
        
        <div className="ad-space">
          {/* 廣告位置 */}
        </div>
        
        <div className="page-title-container">
          <h1 className="page-title">
            <span>Podcast</span>
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
        ) : podcastArticles.length === 0 ? (
          <div className="empty-message">暫無 Podcast 內容</div>
        ) : (
          <ul className="podcast-articles">
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
                          console.error('Podcast 封面載入失敗，路徑:', e.target.src);
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          const container = e.target.parentElement;
                          const unsplashImg = document.createElement('div');
                          container.appendChild(unsplashImg);
                          ReactDOM.render(
                            <UnsplashImage
                              category={article.category || 'podcast'}
                              width={300}
                              height={200}
                              alt={article.title}
                            />,
                            unsplashImg
                          );
                        }}
                      />
                    ) : (
                      <UnsplashImage
                        category={article.category || 'podcast'}
                        width={300}
                        height={200}
                        alt={article.title}
                      />
                    )}
                  </Link>
                </div>
                
                <div className="article-info">
                  <h2 className="article-title">
                    <Link to={`/article/${article.id}`}>{article.title}</Link>
                  </h2>
                  
                  <div className="article-meta">
                    <span className="article-date">
                      {formatDate(article.date || article.created_at)}
                    </span>
                    <span className="article-views">
                      <i className="fas fa-headphones"></i> {formatViews(article.views)}
                    </span>
                  </div>
                  
                  <p className="article-summary">
                    {article.summary || article.content.substring(0, 150) + '...'}
                  </p>

                  <div className="podcast-player">
                    {article.audio_url && (
                      <audio controls>
                        <source src={article.audio_url} type="audio/mpeg" />
                        您的瀏覽器不支持音頻播放器。
                      </audio>
                    )}
                  </div>
                  
                  <Link to={`/article/${article.id}`} className="read-more">
                    查看詳情
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
        
        {/* 分頁控制 */}
        {!loading && !error && podcastArticles.length > 0 && (
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn prev"
            >
              上一頁
            </button>
            
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="page-btn next"
            >
              下一頁
            </button>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default PodcastPage;
