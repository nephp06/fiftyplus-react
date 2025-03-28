import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import PodcastPage from './pages/PodcastPage.jsx';
import PeoplePage from './pages/PeoplePage.jsx';
import AcademyPage from './pages/AcademyPage.jsx';
import MindPage from './pages/MindPage.jsx';
import HealthPage from './pages/HealthPage.jsx';
import LifestylePage from './pages/LifestylePage.jsx';
import FinancePage from './pages/FinancePage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ArticlePage from './pages/ArticlePage.jsx';
import AdminLogin from './pages/AdminLogin';
import DashboardPage from './pages/admin/DashboardPage';
import ArticleListPage from './pages/admin/ArticleListPage';
import ArticleEditPage from './pages/admin/ArticleEditPage';
import CategoryPage from './pages/admin/CategoryPage';
import UserPage from './pages/admin/UserPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminLayout from './layouts/AdminLayout/AdminLayout';
import { authApi } from './services/api';
import './App.css';

// 健康檢查頁面組件
const HealthCheck = () => {
  return (
    <div className="health-check">
      <h1>服務正常運行中</h1>
      <p>應用程序健康狀態：良好</p>
      <p>{new Date().toLocaleString()}</p>
    </div>
  );
};

// 保護路由組件
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};

function App() {
  // 在應用啟動時檢查用戶身份
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        return;
      }
      
      try {
        // 嘗試獲取當前用戶信息
        const result = await authApi.getCurrentUser();
        
        if (result.success && result.data && result.data.role) {
          // 保存或更新用戶角色
          localStorage.setItem('userRole', result.data.role);
        } else {
          // 如果獲取失敗，清除存儲的登錄信息
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        console.error('檢查身份驗證狀態時出錯:', error);
      }
    };
    
    checkAuthStatus();
  }, []);

  return (
    <div className='app'>
      <Routes>
        {/* 前台路由 */}
        <Route path='/' element={<HomePage />} />
        <Route path='/people' element={<PeoplePage />} />
        <Route path='/academy' element={<AcademyPage />} />
        <Route path='/mind' element={<MindPage />} />
        <Route path='/health' element={<HealthPage />} />
        <Route path='/lifestyle' element={<LifestylePage />} />
        <Route path='/finance' element={<FinancePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/article/:id' element={<ArticlePage />} />
        <Route path='/podcast' element={<PodcastPage />} />
        
        {/* 健康檢查路由 */}
        <Route path='/health-check' element={<HealthCheck />} />
        
        {/* 後台路由 */}
        <Route path='/admin/login' element={<AdminLogin />} />
        
        {/* 管理面板路由 - 直接路由 */}
        <Route path='/admin/dashboard' element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        
        <Route path='/admin/articles' element={
          <ProtectedRoute>
            <ArticleListPage />
          </ProtectedRoute>
        } />
        
        <Route path='/admin/articles/new' element={
          <ProtectedRoute>
            <ArticleEditPage />
          </ProtectedRoute>
        } />
        
        <Route path='/admin/articles/edit/:id' element={
          <ProtectedRoute>
            <ArticleEditPage />
          </ProtectedRoute>
        } />
        
        {/* 分類管理路由 */}
        <Route path='/admin/categories' element={
          <ProtectedRoute>
            <CategoryPage />
          </ProtectedRoute>
        } />
        
        {/* 用戶管理路由 */}
        <Route path='/admin/users' element={
          <ProtectedRoute>
            <UserPage />
          </ProtectedRoute>
        } />
        
        {/* 系統設置路由 */}
        <Route path='/admin/settings' element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        {/* 默認管理面板入口 */}
        <Route path='/admin' element={
          <ProtectedRoute>
            <Navigate to="/admin/dashboard" replace />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
