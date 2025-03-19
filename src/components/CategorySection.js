import React from 'react';
import { Link } from 'react-router-dom';
import UnsplashImage from './UnsplashImage';
import './CategorySection.css';

const CategorySection = ({ title, articles }) => {
  return (
    <div className='category-section'>
      <h2 className='category-title'>
        <span className='highlight'>{title}</span>專欄
      </h2>

      <div className='category-articles'>
        {articles.map((article) => (
          <div key={article.id} className='category-article'>
            <div className='article-image'>
              <UnsplashImage
                category={article.imageCategory}
                width={400}
                height={300}
                alt={article.title}
              />
            </div>
            <div className='article-content'>
              <div className='article-date'>{article.date}</div>
              <Link to={`/article/${article.id}`} className='article-title'>
                {article.title}
              </Link>
              <div className='article-stats'>
                <span className='views'>
                  <span className='icon'>👁️</span>{' '}
                  {article.views.toLocaleString()}
                </span>
              </div>
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
