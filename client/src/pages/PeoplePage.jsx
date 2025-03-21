import React, { useState, useEffect } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import UnsplashImage from '../components/UnsplashImage.jsx';
import { Link } from 'react-router-dom';
import './PeoplePage.css';

const PeoplePage = () => {
  // 文章数据（实际项目可从API获取）
  const [peopleArticles, setPeopleArticles] = useState([
    {
      id: 1,
      date: '三月 14,2025',
      title: '清空住了20多年的家，一個人坐在客廳地板覺得好自由！音樂人陳小霞：當你明白自己是誰，可以活得「越老越大」',
      imageCategory: 'person,senior,music',
      views: 71689
    },
    {
      id: 2,
      date: '三月 12,2025',
      title: '當年負債1.6億，一度站在窗邊：「跳下去，明天報紙會怎麼寫？」曹啟泰：能搞笑主持，是快樂救了我',
      imageCategory: 'portrait,smile,success',
      views: 133435
    },
    {
      id: 3,
      date: '三月 06,2025',
      title: '台大醫院院長看遍無數長者的健康體悟！吳明賢：心若大，事情就小！心若小，事情就大',
      imageCategory: 'senior,medical,health',
      views: 86904
    },
    {
      id: 4,
      date: '三月 04,2025',
      title: '90歲仍每天工作，3餐以蔬食為主、3年不吃米飯！謝孟雄：有興趣的人不寂寞，照顧好健康就是愛自己',
      imageCategory: 'senior,wellness,health',
      views: 216560
    },
    {
      id: 5,
      date: '二月 21,2025',
      title: '60歲發表不退休宣言，學AI練腦力！優客李林李驥：第三人生要找到天命，創人生志業',
      imageCategory: 'person,success,portrait',
      views: 55330
    },
    {
      id: 6,
      date: '二月 19,2025',
      title: '不再年輕，還容許勇敢叛逆？沈春華：我不想被主流價值綁架，人生要繼續大膽下去',
      imageCategory: 'portrait,person,senior',
      views: 52612
    },
    {
      id: 7,
      date: '二月 14,2025',
      title: '年輕時什麼事都要問先生，中年後寫作、創合唱團，為自己作主！85歲作家羅伊菲：女人越老越大氣，現在我什麼都不害怕了',
      imageCategory: 'senior,person,success',
      views: 40215
    },
    {
      id: 8,
      date: '二月 13,2025',
      title: '擁抱白髮、改穿球鞋，每天起床幫自己泡一壺清茶！麗豐董事長陳碧華：維持美是壓力，50後決定做一隻慵懶「時尚貓」',
      imageCategory: 'senior,fashion,style',
      views: 212048
    },
    {
      id: 9,
      date: '二月 13,2025',
      title: '治療癌症時如何保持快樂？台大法律名譽教授黃榮堅：身體沒有因為副作用而難受的日子，我就點一杯咖啡、吃一塊蛋糕',
      imageCategory: 'senior,medical,wellness',
      views: 123493
    },
    {
      id: 10,
      date: '二月 13,2025',
      title: '12次化療副作用曾想放棄治療，靠耍廢竟哈哈大笑撐過！作家小彤：接下來的人生，我要用力享受',
      imageCategory: 'person,wellness,success',
      views: 172186
    },
  ]);

  // 格式化阅读量
  const formatViews = (views) => {
    if (views >= 10000) {
      return `${Math.floor(views / 10000)}萬`;
    }
    if (views >= 1000) {
      return `${Math.floor(views / 1000)}千`;
    }
    return views.toString();
  };

  // 页码控制
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;
  
  const totalPages = Math.ceil(peopleArticles.length / articlesPerPage);
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return (
    <div className="people-page">
      <Header />
      
      <div className="people-content container">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <span className="separator">/</span>
          <span className="current">人物</span>
        </div>
        
        <div className="ad-space">
          {/* 广告位置 */}
        </div>
        
        <div className="page-title-container">
          <h1 className="page-title">
            <span>人物</span>
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
        
        <ul className="people-articles">
          {peopleArticles.map((article) => (
            <li key={article.id} className="article-item">
              <div className="article-thumb">
                <Link to={`/article/${article.id}`}>
                  <UnsplashImage 
                    category={article.imageCategory} 
                    width={350} 
                    height={240} 
                    alt={article.title} 
                  />
                </Link>
              </div>
              
              <div className="article-info">
                <div className="article-date">{article.date}</div>
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

export default PeoplePage; 