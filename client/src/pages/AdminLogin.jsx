import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
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
      // 使用 authApi 進行登錄
      const result = await authApi.login(formData);
      
      console.log('登錄響應:', result);
      
      if (!result.success) {
        throw new Error(result.message || '登錄失敗');
      }
      
      // 保存令牌到本地存儲
      localStorage.setItem('token', result.data.token);
      console.log('令牌已保存:', result.data.token);
      
      // 保存用戶角色到本地存儲
      if (result.data.user && result.data.user.role) {
        localStorage.setItem('userRole', result.data.user.role);
        console.log('用戶角色已保存:', result.data.user.role);
      } else if (result.data.role) {
        localStorage.setItem('userRole', result.data.role);
        console.log('用戶角色已保存(從data.role):', result.data.role);
      }
      
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
      // 使用 authApi 進行註冊
      const result = await authApi.register(registrationData);
      
      console.log('註冊響應:', result);
      
      if (!result.success) {
        throw new Error(result.message || '註冊失敗');
      }
      
      // 保存令牌到本地存儲
      localStorage.setItem('token', result.data.token);
      console.log('令牌已保存:', result.data.token);
      
      // 保存用戶角色到本地存儲
      if (result.data.user && result.data.user.role) {
        localStorage.setItem('userRole', result.data.user.role);
        console.log('用戶角色已保存:', result.data.user.role);
      } else if (result.data.role) {
        localStorage.setItem('userRole', result.data.role);
        console.log('用戶角色已保存(從data.role):', result.data.role);
      }
      
      // 重定向到管理面板
      navigate('/admin');
    } catch (err) {
      console.error('註冊錯誤:', err);
      setError(err.message || '註冊時出錯');
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