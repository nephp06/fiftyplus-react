import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
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

  return (
    <header className='header'>
      <div className='header-container'>
        <div className='logo-container'>
          <Link to='/' className='logo'>
            <span className='logo-heart'>Heart</span>
            <span className='logo-wise'>Wise</span>
          </Link>
        </div>

        <nav className='main-nav'>
          <ul className='nav-list'>
            {navItems.map((item) => (
              <li key={item.id} className='nav-item'>
                <Link to={item.path} className='nav-link'>
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className='header-actions'>
          <button className='search-button'>
            <span className='icon'>🔍</span>
          </button>
          <button className='menu-button'>
            <span className='icon'>☰</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
