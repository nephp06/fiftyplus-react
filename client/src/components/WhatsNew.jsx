import React from 'react';
import { Link } from 'react-router-dom';
import UnsplashImage from './UnsplashImage.jsx';
import './WhatsNew.css';

const WhatsNew = ({ articles }) => {
  return (
    <div className='whats-new'>
      <div className='hot-articles'>
        {articles.map((article) => (
          <div key={article.id} className='hot-article'>
            <div className='hot-article-number'>{article.number}</div>
            <div className='hot-article-content'>
              <Link
                to={`/article/${article.id}`}
                className='hot-article-title'
              >
                {article.title}
              </Link>
            </div>
            <div className='hot-article-image'>
              <UnsplashImage
                category={article.imageCategory}
                width={160}
                height={160}
                alt={article.title}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhatsNew;
