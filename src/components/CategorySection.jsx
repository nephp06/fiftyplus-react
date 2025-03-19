import React from 'react';
import { Link } from 'react-router-dom';
import UnsplashImage from './UnsplashImage.jsx';
import './CategorySection.css';

const CategorySection = ({ title, articles }) => {
  const formatViews = (views) => {
    if (views >= 10000) {
      return `${Math.floor(views / 10000)}萬`;
    }
    if (views >= 1000) {
      return `${Math.floor(views / 1000)}千`;
    }
    return views.toString();
  };

  return (
    <div className='category-section'>
      <h2 className='section-title'>
        <span className='highlight'>{title}</span>專欄
      </h2>

      <div className='articles'>
        {articles.map((article) => (
          <div key={article.id} className='article-card'>
            <div className='article-image'>
              <UnsplashImage
                category={article.imageCategory}
                width={400}
                height={300}
                alt={article.title}
              />
            </div>
            <div className='article-content'>
              <div className='article-meta'>
                <span className='article-date'>{article.date}</span>
                {article.views && (
                  <span className='article-views'>
                    {formatViews(article.views)}次閱讀
                  </span>
                )}
              </div>
              <Link
                to={`/article/${article.id}`}
                className='article-title-link'
              >
                <h3 className='article-title'>{article.title}</h3>
              </Link>
            </div>
          </div>
        ))}
      </div>

      <Link to={`/category/${title.toLowerCase()}`} className='view-more-link'>
        查看更多 {title}專欄 <span className='arrow'>→</span>
      </Link>
    </div>
  );
};

export default CategorySection;
