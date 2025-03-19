import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import './App.css';

function App() {
  return (
    <div className='app'>
      <Routes>
        <Route path='/' element={<HomePage />} />
        {/* 添加更多路由 */}
      </Routes>
    </div>
  );
}

export default App;
