import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnsplashImage from '../components/UnsplashImage';
import Carousel from '../components/Carousel';
import { formatViews } from '../utils/format';
import { getImageUrl } from '../utils/imageUtils';
import './HomePage.css';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

// 默认轮播图数据（備用）
const DEFAULT_SLIDES = [
  {
    id: 1,
    imageUrl: 'https://source.unsplash.com/random/1600x900/?retirement',
    title: '從心出發：探索熟齡生活的無限可能',
    subtitle: '人生的下半場，我們有更多時間來追求自己真正熱愛的事物',
    category: '生活',
    url: '/article/1'
  },
  {
    id: 2,
    imageUrl: 'https://source.unsplash.com/random/1600x900/?health,elderly',
    title: '50+健康管理：保持活力的秘訣',
    subtitle: '從飲食到運動，全方位照顧中高齡健康',
    category: '健康',
    url: '/article/2'
  },
  {
    id: 3,
    imageUrl: 'https://source.unsplash.com/random/1600x900/?travel,senior',
    title: '熟齡旅行：走訪台灣的絕美秘境',
    subtitle: '適合熟齡族的深度旅遊路線推薦',
    category: '旅遊',
    url: '/article/3'
  },
  {
    id: 4,
    imageUrl: 'https://source.unsplash.com/random/1600x900/?finance,investment',
    title: '退休理財規劃：安心享受人生下半場',
    subtitle: '專家分享如何妥善規劃退休金，實現財務自由',
    category: '理財',
    url: '/article/4'
  }
];

// 根據數據庫文章創建輪播圖幻燈片
const createSlidesFromArticles = (articles) => {
  if (!articles) return DEFAULT_SLIDES;
  
  // 合併不同類別的文章並按照瀏覽量排序
  const allArticles = [
    ...(articles.people || []),
    ...(articles.mind || []),
    ...(articles.health || []),
    ...(articles.lifestyle || []),
    ...(articles.finance || [])
  ].sort((a, b) => (b.views || 0) - (a.views || 0))
  .slice(0, 4); // 取前4篇文章作為輪播圖
  
  if (allArticles.length === 0) return DEFAULT_SLIDES;
  
  return allArticles.map(article => ({
    id: article.id,
    imageUrl: article.image_url ? getImageUrl(article.image_url) 
             : `https://source.unsplash.com/random/1600x900/?${article.category || 'senior'}`,
    title: article.title,
    subtitle: article.summary || '為50+族群提供精彩內容',
    category: article.category || '生活',
    url: `/article/${article.id}`
  }));
};

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

const HomePage = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredSlides, setFeaturedSlides] = useState(DEFAULT_SLIDES); // 使用默认数据作為初始值

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        console.log('开始获取首页数据...');
        
        const response = await fetch('/api/homepage');
        console.log('API响应状态:', response.status);
        
        if (!response.ok) {
          throw new Error(`获取数据失败: ${response.status}`);
        }
        
        const responseText = await response.text();
        console.log('API响应文本:', responseText);
        
        let data;
        try {
          data = JSON.parse(responseText);
          console.log('API返回数据(解析后):', data);
          console.log('API返回数据结构:', Object.keys(data));
          if (data.data) {
            console.log('實際數據位於data字段中，包含以下類別:', Object.keys(data.data));
            data = data.data; // 提取正確的數據結構
          }
        } catch (parseError) {
          console.error('JSON解析错误:', parseError);
          throw new Error('无法解析返回的JSON数据');
        }
        
        // 验证返回的数据结构
        if (!data || typeof data !== 'object') {
          throw new Error('返回的数据格式不正确');
        }
        
        console.log('人物文章数量:', data.people ? data.people.length : 0);
        if (data.people && data.people.length > 0) {
          console.log('第一篇人物文章:', data.people[0]);
          console.log('第一篇人物文章標題:', data.people[0].title);
          console.log('第一篇人物文章圖片:', data.people[0].image_url);
          console.log('第一篇人物文章日期:', data.people[0].created_at || data.people[0].date);
        }
        console.log('热门文章数量:', data.hot ? data.hot.length : 0);
        
        // 安全设置文章数据
        const articlesData = {
          people: Array.isArray(data.people) ? data.people : [],
          hot: Array.isArray(data.hot) ? data.hot : [],
          mind: Array.isArray(data.mind) ? data.mind : [],
          health: Array.isArray(data.health) ? data.health : [],
          lifestyle: Array.isArray(data.lifestyle) ? data.lifestyle : [],
          finance: Array.isArray(data.finance) ? data.finance : [],
          podcast: Array.isArray(data.podcast) ? data.podcast : []
        };
        
        setArticles(articlesData);
        
        // 使用文章數據創建輪播圖幻燈片
        const slides = createSlidesFromArticles(articlesData);
        setFeaturedSlides(slides);
        
        console.log('設置到狀態的文章數據:', {
          people: articlesData.people.length,
          hot: articlesData.hot.length,
          mind: articlesData.mind.length,
          health: articlesData.health.length,
          lifestyle: articlesData.lifestyle.length,
          finance: articlesData.finance.length,
          podcast: articlesData.podcast.length
        });
        
        setError(null);
      } catch (err) {
        console.error('获取数据错误:', err);
        setError(err.message || '未知错误');
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  if (loading) {
    return (
      <div className="homepage">
        <Header />
        <main className="main-content">
          <div className="loading">加載中...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="homepage">
        <Header />
        <main className="main-content">
          <div className="error-message">{error}</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!articles) {
    return (
      <div className="homepage">
        <Header />
        <main className="main-content">
          <div className="error-message">無法加載數據</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="homepage">
      <Header />
      <main className="main-content">
        {featuredSlides.length > 0 && (
          <div className="hero-section">
            <Carousel slides={featuredSlides} autoPlay={true} />
          </div>
        )}
        
        <div className="top-sections-container">
          <div className="top-section section-people">
            <h2 className="section-title chinese">
              <span className="icon">+</span>
              人物
            </h2>
            <div className={`people-articles ${articles.people && articles.people.length < 2 ? 'single-column' : ''}`}>
              {articles.people && articles.people.length > 0 ? (
                articles.people.map(article => (
                  <article key={article.id} className="article-card">
                    <div className="article-image">
                      {article.image_url ? (
                        <img
                          src={getImageUrl(article.image_url)}
                          alt={article.title}
                          className="article-image-content"
                          loading="lazy"
                          onError={(e) => {
                            console.error('文章圖片載入失敗，路徑:', e.target.src);
                            e.target.onerror = null;
                            // 使用 UnsplashImage 作為後備
                            e.target.style.display = 'none';
                            const container = e.target.parentElement;
                            const unsplashImg = document.createElement('div');
                            container.appendChild(unsplashImg);
                            // 渲染 UnsplashImage 組件的替代方案
                            ReactDOM.render(
                              <UnsplashImage
                                category={article.image_category || article.imageCategory || 'people'}
                                width={480}
                                height={320}
                                alt={article.title}
                              />,
                              unsplashImg
                            );
                          }}
                        />
                      ) : (
                        <UnsplashImage
                          category={article.image_category || article.imageCategory || 'people'}
                          width={480}
                          height={320}
                          alt={article.title}
                        />
                      )}
                      <div className="article-date">
                        {article.created_at ? formatDate(article.created_at) : 
                         article.date ? article.date : '無日期'}
                      </div>
                    </div>
                    <div className="article-content">
                      <h3 className="article-title">
                        <Link to={`/article/${article.id}`}>
                          {article.title}
                        </Link>
                      </h3>
                      <div className="article-views">
                        <span className="view-icon">👁</span> {formatViews(article.views)}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="empty-message">暫無人物文章</div>
              )}
            </div>
          </div>

          <div className="whats-new section-new">
            <h2 className="section-title">What's New</h2>
            <div className="whats-new-articles">
              {articles.hot && articles.hot.length > 0 ? (
                articles.hot.slice(0, 5).map((article, index) => (
                  <article key={article.id} className="whats-new-article">
                    <Link to={`/article/${article.id}`} className="whats-new-link" style={{
                      background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${article.image_url || ""}) no-repeat center/cover`
                    }}>
                      <div className="whats-new-content">
                        <h3 className="h4">
                          <span className="num">{index + 1}</span>
                          <span style={{color: "#fff", textShadow: "1px 1px 2px rgba(0,0,0,0.8)"}}>{article.title.trim()}</span>
                        </h3>
                      </div>
                    </Link>
                  </article>
                ))
              ) : (
                <div className="empty-message">暫無最新文章</div>
              )}
            </div>
          </div>
        </div>

        <div className="category-sections">
          {['mind', 'health', 'lifestyle', 'finance', 'podcast'].map(category => (
            <div key={category} className="category-section">
              <h2 className="section-title chinese">
                <span className="icon">+</span>
                {category === 'mind' ? '心靈' : 
                 category === 'health' ? '健康' : 
                 category === 'lifestyle' ? '生活' :
                 category === 'finance' ? '財經' :
                 category === 'podcast' ? '播客' : ''}
              </h2>
              <div className={`category-articles ${articles[category] && articles[category].length < 2 ? 'single-column' : ''}`}>
                {articles[category] && articles[category].length > 0 ? (
                  articles[category].map(article => (
                    <article key={article.id} className="article-card">
                      <div className="article-image">
                        {article.image_url ? (
                          <img
                            src={getImageUrl(article.image_url)}
                            alt={article.title}
                            className="article-image-content"
                            loading="lazy"
                            onError={(e) => {
                              console.error('文章圖片載入失敗，路徑:', e.target.src);
                              e.target.onerror = null;
                              // 使用 UnsplashImage 作為後備
                              e.target.style.display = 'none';
                              const container = e.target.parentElement;
                              const unsplashImg = document.createElement('div');
                              container.appendChild(unsplashImg);
                              // 渲染 UnsplashImage 組件的替代方案
                              ReactDOM.render(
                                <UnsplashImage
                                  category={article.image_category || article.imageCategory || category}
                                  width={480}
                                  height={320}
                                  alt={article.title}
                                />,
                                unsplashImg
                              );
                            }}
                          />
                        ) : (
                          <UnsplashImage
                            category={article.image_category || article.imageCategory || category}
                            width={480}
                            height={320}
                            alt={article.title}
                          />
                        )}
                        <div className="article-date">
                          {article.created_at ? formatDate(article.created_at) : 
                           article.date ? article.date : '無日期'}
                        </div>
                      </div>
                      <div className="article-content">
                        <h3 className="article-title">
                          <Link to={`/article/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <div className="article-views">
                          <span className="view-icon">👁</span> {formatViews(article.views)}
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty-message">暫無文章</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
