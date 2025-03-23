import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // 關閉菜單函數
  const closeMenu = () => {
    setMenuOpen(false);
  };

  // 切換菜單開關狀態
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // 當路由變化時自動關閉菜單
  useEffect(() => {
    closeMenu();
  }, [location]);

  const navItems = [
    { id: 1, title: '學院', path: '/academy' },
    { id: 2, title: '心靈', path: '/mind' },
    { id: 3, title: '人物', path: '/people' },
    { id: 4, title: '生活', path: '/lifestyle' },
    { id: 5, title: '健康', path: '/health' },
    { id: 6, title: '社會', path: '/society' },
    { id: 7, title: '退休理財', path: '/finance' },
    { id: 8, title: '精選專題', path: '/featured' },
  ];

  const navLinks = [
    { title: '首頁', path: '/' },
    { title: '人物', path: '/people' },
    { title: '心靈', path: '/mind' },
    { title: '健康', path: '/health' },
    { title: '生活方式', path: '/lifestyle' },
    { title: '財經', path: '/finance' },
    { title: '學院', path: '/academy' },
    { title: '播客', path: '/podcast' },
  ];

  return (
    <header className='header'>
      <div className='header-container'>
        <div className='logo-container'>
          <Link to='/' className='logo'>
            <span className='logo-heart'>Heart</span>
            <span className='logo-wise'>Wise</span>
          </Link>
        </div>

        <nav className={`main-nav ${menuOpen ? 'open' : ''}`}>
          <ul className="nav-list">
            {navLinks.map((link, index) => (
              <li key={index} className="nav-item">
                <Link 
                  to={link.path} 
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='header-actions'>
          <button className='search-button'>
            <span className='icon'>🔍</span>
          </button>
          <button className='menu-button' onClick={toggleMenu}>
            <span className='icon'>☰</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
