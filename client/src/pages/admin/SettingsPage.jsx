import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import './SettingsPage.css';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    siteName: 'FiftyPlus',
    siteDescription: '五十加 - 为熟龄人士提供优质内容的在线平台',
    contactEmail: 'info@fiftyplus.com',
    articlesPerPage: 10,
    enableComments: true,
    maintenance: false,
    theme: 'light'
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // 针对不同类型的输入做处理
    const inputValue = type === 'checkbox' ? checked : 
                       type === 'number' ? parseInt(value) : value;
    
    setSettings({
      ...settings,
      [name]: inputValue
    });
    
    // 清除之前的成功或错误信息
    setSuccess(false);
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // 模拟API保存过程
    setTimeout(() => {
      // 这里应该是实际的API调用
      console.log('保存的设置:', settings);
      setLoading(false);
      setSuccess(true);
      
      // 5秒后清除成功消息
      setTimeout(() => setSuccess(false), 5000);
    }, 1000);
  };

  const resetToDefaults = () => {
    if (window.confirm('确定要重置所有设置到默认值吗？')) {
      setSettings({
        siteName: 'FiftyPlus',
        siteDescription: '五十加 - 为熟龄人士提供优质内容的在线平台',
        contactEmail: 'info@fiftyplus.com',
        articlesPerPage: 10,
        enableComments: true,
        maintenance: false,
        theme: 'light'
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  return (
    <AdminLayout>
      <div className="settings-page">
        <div className="page-header">
          <h1>系统设置</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {success && (
          <div className="success-message">
            设置已成功保存！
            <button onClick={() => setSuccess(false)}>×</button>
          </div>
        )}

        <div className="settings-container">
          <form onSubmit={handleSubmit}>
            <div className="settings-section">
              <h2>网站基本设置</h2>
              
              <div className="form-group">
                <label htmlFor="siteName">网站名称</label>
                <input
                  type="text"
                  id="siteName"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="siteDescription">网站描述</label>
                <textarea
                  id="siteDescription"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="contactEmail">联系邮箱</label>
                <input
                  type="email"
                  id="contactEmail"
                  name="contactEmail"
                  value={settings.contactEmail}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="settings-section">
              <h2>内容设置</h2>
              
              <div className="form-group">
                <label htmlFor="articlesPerPage">每页文章数量</label>
                <input
                  type="number"
                  id="articlesPerPage"
                  name="articlesPerPage"
                  value={settings.articlesPerPage}
                  onChange={handleInputChange}
                  min="5"
                  max="50"
                />
              </div>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="enableComments"
                  name="enableComments"
                  checked={settings.enableComments}
                  onChange={handleInputChange}
                />
                <label htmlFor="enableComments">启用评论功能</label>
              </div>
            </div>
            
            <div className="settings-section">
              <h2>系统设置</h2>
              
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="maintenance"
                  name="maintenance"
                  checked={settings.maintenance}
                  onChange={handleInputChange}
                />
                <label htmlFor="maintenance">维护模式</label>
                <p className="description">启用后，非管理员用户将无法访问网站</p>
              </div>
              
              <div className="form-group">
                <label htmlFor="theme">网站主题</label>
                <select
                  id="theme"
                  name="theme"
                  value={settings.theme}
                  onChange={handleInputChange}
                >
                  <option value="light">浅色主题</option>
                  <option value="dark">深色主题</option>
                  <option value="colorful">多彩主题</option>
                </select>
              </div>
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="btn-reset"
                onClick={resetToDefaults}
              >
                恢复默认
              </button>
              <button
                type="submit"
                className="btn-save"
                disabled={loading}
              >
                {loading ? '保存中...' : '保存设置'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SettingsPage; 