import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    // 清除本地存储的token
    localStorage.removeItem('token');
    // 跳转到登录页
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-left">
          <button 
            className="menu-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <h1>FiftyPlus CMS</h1>
        </div>
        <div className="admin-header-right">
          <button onClick={handleLogout} className="logout-button">
            退出登录
          </button>
        </div>
      </header>
      
      <div className="admin-container">
        <aside className={`admin-sidebar ${isMenuOpen ? 'open' : ''}`}>
          <nav className="admin-nav">
            <ul>
              <li>
                <Link to="/admin/dashboard">
                  <i className="fas fa-home"></i>
                  控制台
                </Link>
              </li>
              <li>
                <Link to="/admin/articles">
                  <i className="fas fa-newspaper"></i>
                  文章管理
                </Link>
              </li>
              <li>
                <Link to="/admin/categories">
                  <i className="fas fa-tags"></i>
                  分类管理
                </Link>
              </li>
              <li>
                <Link to="/admin/users">
                  <i className="fas fa-users"></i>
                  用户管理
                </Link>
              </li>
              <li>
                <Link to="/admin/settings">
                  <i className="fas fa-cog"></i>
                  系统设置
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout; 