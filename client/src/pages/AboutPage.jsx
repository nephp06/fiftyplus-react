import React from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
  return (
    <div className="about-page">
      <Header />
      
      <div className="about-content container">
        <div className="breadcrumb">
          <Link to="/">首頁</Link>
          <span className="separator">/</span>
          <span className="current">關於我們</span>
        </div>
        
        <div className="page-title-container">
          <h1 className="page-title">
            <span>關於我們</span>
          </h1>
        </div>
        
        <div className="about-section">
          <h2>公司介紹</h2>
          <p>
            心智達股份有限公司成立於2023年，是一家專注於熟齡人士生活、健康和財經內容的數位媒體公司。
            我們致力於提供高品質且實用的內容，幫助50歲以上的讀者活出精彩、健康的生活，並在各方面做出明智的選擇。
          </p>
        </div>
        
        <div className="about-section">
          <h2>我們的使命</h2>
          <p>
            我們相信，人生的下半場可以更精彩。心智達的使命是成為熟齡讀者的思想夥伴，
            通過提供獨到的見解、實用的建議和鼓舞人心的故事，幫助他們在健康、財富、人際關係和個人成長等方面取得平衡與成就。
          </p>
        </div>
        
        <div className="about-section">
          <h2>我們的願景</h2>
          <p>
            成為台灣最受信賴的熟齡內容平台，讓每一位讀者都能透過我們的內容，獲得啟發並活出充滿活力的人生。
          </p>
        </div>
        
        <div className="about-section">
          <h2>核心價值</h2>
          <ul className="values-list">
            <li><strong>專業可靠</strong> - 所有內容都經過專業審核，確保資訊準確無誤</li>
            <li><strong>尊重包容</strong> - 尊重每個人的獨特經歷和需求</li>
            <li><strong>實用創新</strong> - 提供實用且創新的解決方案</li>
            <li><strong>終身學習</strong> - 鼓勵讀者保持好奇心，持續學習和成長</li>
          </ul>
        </div>
        
        <div className="about-section">
          <h2>聯絡資訊</h2>
          <p>
            <strong>公司名稱：</strong>心智達股份有限公司<br />
            <strong>地址：</strong>台北市信義區松仁路100號<br />
            <strong>電話：</strong>(02) 2345-6789<br />
            <strong>服務信箱：</strong>heartwise@cwgv.com.tw
          </p>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AboutPage; 