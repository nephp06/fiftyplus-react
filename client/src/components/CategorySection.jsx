import React from 'react';
import { Link } from 'react-router-dom';
import { formatViews } from '../utils/format';
import UnsplashImage from './UnsplashImage.jsx';
import './CategorySection.css';

const CategorySection = ({ title, articles }) => {
  return (
    <section className="category-section">
      <h2 className="category-title">{title}專欄</h2>
      <div className="articles-list">
        {articles.map(article => (
          <article key={article.id} className="article-card">
            <div className="article-image">
              <UnsplashImage
                category={article.imageCategory}
                width={480}
                height={320}
                alt={article.title}
              />
            </div>
            <div className="article-content">
              <div className="article-date">{article.date}</div>
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
    </section>
  );
};

export default CategorySection;
