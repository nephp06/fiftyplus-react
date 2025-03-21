import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registrationData, setRegistrationData] = useState({
    username: '',
    password: '',
    email: '',
  });
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRegistrationInputChange = (e) => {
    const { name, value } = e.target;
    setRegistrationData({ ...registrationData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('登录响应:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || '登录失败');
      }

      // 保存令牌到本地存储
      localStorage.setItem('token', data.data.token);
      console.log('登录成功，令牌已保存');

      // 重定向到管理面板
      navigate('/admin');
    } catch (err) {
      console.error('登录错误:', err);
      setError(err.message || '登录时出错');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();
      console.log('注册响应:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || '注册失败');
      }

      // 保存令牌到本地存储
      localStorage.setItem('token', data.data.token);
      console.log('注册成功，令牌已保存');

      // 重定向到管理面板
      navigate('/admin');
    } catch (err) {
      console.error('注册错误:', err);
      setError(err.message || '注册时出错');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <h1>管理员{showRegister ? '注册' : '登录'}</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        {!showRegister ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? '登录中...' : '登录'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="reg-username">用户名</label>
              <input
                type="text"
                id="reg-username"
                name="username"
                value={registrationData.username}
                onChange={handleRegistrationInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-email">电子邮箱</label>
              <input
                type="email"
                id="reg-email"
                name="email"
                value={registrationData.email}
                onChange={handleRegistrationInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="reg-password">密码</label>
              <input
                type="password"
                id="reg-password"
                name="password"
                value={registrationData.password}
                onChange={handleRegistrationInputChange}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? '注册中...' : '注册'}
            </button>
          </form>
        )}
        
        <div className="toggle-form">
          <button 
            onClick={() => setShowRegister(!showRegister)}
            className="toggle-button"
          >
            {showRegister ? '返回登录' : '创建新账户'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 