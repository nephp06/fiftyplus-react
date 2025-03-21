import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnsplashImage from '../components/UnsplashImage';
import { formatViews, formatNumber } from '../utils/format';
import { getImageUrl } from '../utils/imageUtils';
import './ArticlePage.css';

const ArticlePage = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        
        <main className="article-main">
          <h1 className="article-title">{article.title}</h1>
          
          <div className="article-meta">
            <div className="article-info">
              <span className="article-date">{format(new Date(article.date), 'MMM d, yyyy')}</span>
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