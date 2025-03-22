import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const footerLinks = [
    { title: '關於我們', path: '/about' },
    { title: '加入會員', path: '/membership' },
    { title: '隱私權聲明', path: '/privacy' },
    { title: '服務條款', path: '/terms' },
    { title: '聯絡我們', path: '/contact' },
  ];

  return (
    <footer className='footer'>
      <div className='footer-container'>
        <div className='footer-top'>
          <div className='footer-logo'>
            <Link to='/' className='logo'>
              <span className='logo-heart'>Heart</span>{' '}
              <span className='logo-wise'>Wise</span>
            </Link>
            <p className='tagline'>從心出發，精彩續寫人生新篇</p>
          </div>

          <div className='footer-links'>
            <ul className='footer-nav'>
              {footerLinks.map((link, index) => (
                <li key={index} className='footer-nav-item'>
                  <Link to={link.path} className='footer-nav-link'>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className='footer-social'>
            <h3 className='social-title'>關注我們</h3>
            <div className='social-icons'>
              <a
                href='https://www.facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-icon'
              >
                <span className='icon'>📱</span>
              </a>
              <a
                href='https://www.instagram.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-icon'
              >
                <span className='icon'>📷</span>
              </a>
              <a
                href='https://www.youtube.com'
                target='_blank'
                rel='noopener noreferrer'
                className='social-icon'
              >
                <span className='icon'>📺</span>
              </a>
            </div>
          </div>
        </div>

        <div className='footer-bottom'>
          <div className='copyright'>© 2025 心智達股份有限公司</div>
          <div className='contact-email'>服務信箱：heartwise@heartwise.com.tw</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
