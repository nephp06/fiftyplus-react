import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnsplashImage from '../components/UnsplashImage';
import { formatViews, formatNumber } from '../utils/format';
import { getImageUrl } from '../utils/imageUtils';
import { authApi } from '../services/api';
import './ArticlePage.css';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // 检查用户是否是管理员
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAdmin(false);
          return;
        }
        
        const userRole = localStorage.getItem('userRole');
        
        // 如果已保存角色資訊，則直接使用
        if (userRole) {
          setIsAdmin(userRole === 'admin' || userRole === 'editor');
          return;
        }
        
        // 如果沒有保存角色資訊，則從服務器獲取當前用戶信息
        try {
          const currentUser = await authApi.getCurrentUser();
          if (currentUser.success && currentUser.data && currentUser.data.role) {
            localStorage.setItem('userRole', currentUser.data.role);
            setIsAdmin(currentUser.data.role === 'admin' || currentUser.data.role === 'editor');
          }
        } catch (err) {
          console.error('獲取用戶信息失敗:', err);
          setIsAdmin(false);
        }
      } catch (err) {
        console.error('檢查管理員權限時出錯:', err);
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, []);

  // 新增一個中文日期格式化函數，與首頁一致
  const formatChineseDate = (dateString) => {
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

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/articles/${id}`);
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || '文章获取失败');
        }
        
        setArticle(result.data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // 處理編輯按鈕點擊
  const handleEditClick = () => {
    navigate(`/admin/articles/edit/${id}`);
  };

  if (loading) {
    return (
      <div className="article-page">
        <Header />
        <div className="article-content container">
          <div className="loading">加載中...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="article-page">
        <Header />
        <div className="article-content container">
          <div className="error-message">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-page">
        <Header />
        <div className="article-content container">
          <div className="error-message">文章不存在</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="article-page">
      <Header />
      
      <div className="article-content container">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <span className="separator">/</span>
          <Link to="/people">人物</Link>
          <span className="separator">/</span>
          <span className="current">文章</span>
        </div>
        
        {/* 管理員編輯按鈕 */}
        {isAdmin && (
          <div className="admin-actions">
            <button 
              className="edit-article-btn" 
              onClick={handleEditClick}
            >
              編輯文章
            </button>
          </div>
        )}
        
        <main className="article-main">
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="article-info">
              <span className="article-date">{formatChineseDate(article.date || article.created_at)}</span>
              <span className="article-views">
                <i className="fas fa-eye"></i> {formatNumber(article.views)}
              </span>
            </div>
            
            <div className="share-buttons">
              <a href="#" className="share-btn facebook">
                <i className="icon-facebook"></i>
              </a>
              <a href="#" className="share-btn line">
                <i className="icon-line"></i>
              </a>
            </div>
          </div>
          
          <div className="article-cover">
            <div className="category-tag">
              {article.category === 'people' ? '人物' : 
               article.category === 'mind' ? '心靈' : 
               article.category === 'health' ? '健康' : 
               article.category === 'lifestyle' ? '生活方式' :
               article.category === 'finance' ? '財經' :
               article.category === 'podcast' ? '播客' : 
               article.category === 'academy' ? '學院' : '新聞'}
            </div>
            <div className="cover-date">
              {formatChineseDate(article.date || article.created_at)}
            </div>
            {article.image_url ? (
              <img 
                src={getImageUrl(article.image_url)}
                alt={article.title} 
                className="article-image" 
                onError={(e) => {
                  console.log('文章圖片載入失敗，路徑:', e.target.src);
                  e.target.onerror = null;
                  e.target.src = '/assets/images/default-article.svg';
                }}
              />
            ) : (
              <UnsplashImage 
                category={article.imageCategory}
                width={800}
                height={400}
                alt={article.title}
              />
            )}
          </div>
          
          <div className="article-content">
            <div className="article-credits">
              <span>撰文：{article.author}</span>
              <span>攝影：{article.photographer}</span>
              <span>編輯：{article.editor}</span>
            </div>
            
            {Array.isArray(article.content) ? (
              article.content.map((block, index) => {
                if (block.type === 'paragraph') {
                  return <p key={index}>{block.content}</p>;
                } else if (block.type === 'image') {
                  return (
                    <div key={index} className="article-image">
                      <UnsplashImage category={block.category || article.imageCategory} />
                      {block.caption && <p className="image-caption">{block.caption}</p>}
                    </div>
                  );
                }
                return null;
              })
            ) : (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            )}
          </div>
        </main>
        
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <div className="related-articles">
            <h3 className="related-title">相關文章</h3>
            <div className="related-articles-grid">
              {article.relatedArticles.map(related => (
                <a key={related.id} href={`/article/${related.id}`} className="related-article-card">
                  <div className="related-article-image">
                    {related.image_url ? (
                      <img 
                        src={getImageUrl(related.image_url)}
                        alt={related.title}
                        className="related-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/default-article.svg';
                        }}
                      />
                    ) : (
                      <UnsplashImage 
                        category={related.imageCategory}
                        width={350}
                        height={200}
                        alt={related.title}
                      />
                    )}
                  </div>
                  <div className="related-article-info">
                    <h4>{related.title}</h4>
                    <span className="related-article-views">
                      <i className="fas fa-eye"></i> {formatNumber(related.views)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticlePage; 