import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UnsplashImage from '../components/UnsplashImage';
import Carousel from '../components/Carousel';
import { formatViews } from '../utils/format';
import './HomePage.css';
import { Link } from 'react-router-dom';

// 默认轮播图数据
const DEFAULT_SLIDES = [
  {
    id: 1,
    imageUrl: 'https://source.unsplash.com/random/1600x900/?retirement',
    title: '退休後的第二人生：探索新的可能',
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

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}月 ${day},${year}`;
};

const HomePage = () => {
  const [articles, setArticles] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [featuredSlides, setFeaturedSlides] = useState(DEFAULT_SLIDES); // 使用默认数据

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
        } catch (parseError) {
          console.error('JSON解析错误:', parseError);
          throw new Error('无法解析返回的JSON数据');
        }
        
        // 验证返回的数据结构
        if (!data || typeof data !== 'object') {
          throw new Error('返回的数据格式不正确');
        }
        
        console.log('人物文章数量:', data.people ? data.people.length : 0);
        console.log('热门文章数量:', data.hot ? data.hot.length : 0);
        
        // 安全设置文章数据
        setArticles({
          people: Array.isArray(data.people) ? data.people : [],
          hot: Array.isArray(data.hot) ? data.hot : [],
          mind: [],
          health: [],
          lifestyle: []
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
          <div className="top-section">
            <h2 className="section-title chinese">
              <span className="icon">+</span>
              人物
            </h2>
            <div className="people-articles">
              {articles.people && articles.people.map(article => (
                <article key={article.id} className="article-card">
                  <div className="article-image">
                    <UnsplashImage
                      category={article.image_category}
                      width={480}
                      height={320}
                      alt={article.title}
                    />
                  </div>
                  <div className="article-content">
                    <div className="article-date">{formatDate(article.created_at)}</div>
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
              ))}
            </div>
          </div>

          <div className="whats-new">
            <h2 className="section-title">What's New</h2>
            <div className="whats-new-articles">
              {articles.hot && articles.hot.map((article, index) => (
                <article key={article.id} className="whats-new-article">
                  <span className="article-number">{index + 1}</span>
                  <div className="article-content">
                    <h3 className="article-title">
                      <Link to={`/article/${article.id}`}>
                        {article.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="category-sections">
          {['mind', 'health', 'lifestyle'].map(category => (
            <div key={category} className="category-section">
              <h2 className="section-title">
                <span className="icon">+</span>
                {category === 'mind' ? '心靈' : 
                 category === 'health' ? '健康' : '生活'}
              </h2>
              <div className="category-articles">
                {articles[category] && articles[category].map(article => (
                  <article key={article.id} className="article-card">
                    <div className="article-image">
                      <UnsplashImage
                        category={article.image_category}
                        width={480}
                        height={320}
                        alt={article.title}
                      />
                    </div>
                    <div className="article-content">
                      <div className="article-date">{formatDate(article.created_at)}</div>
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
                ))}
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
