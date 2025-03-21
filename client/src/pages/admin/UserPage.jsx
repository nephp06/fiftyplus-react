import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import './UserPage.css';

const UserPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'editor' });
  const [editingUser, setEditingUser] = useState(null);

  // 从API加载用户数据
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('获取用户数据失败');
      }
      
      const data = await response.json();
      // 检查API返回的数据结构
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data);
      } else if (Array.isArray(data)) {
        setUsers(data);
      } else {
        // 如果都不是，则可能是API返回了非预期的数据结构
        console.error('API返回的数据结构不符合预期:', data);
        setUsers([]);
      }
    } catch (err) {
      console.error('Error loading users:', err);
      setError('无法加载用户数据: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email || !newUser.password) {
      setError('用户名、邮箱和密码不能为空');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newUser)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '添加用户失败');
      }

      // 添加成功提示
      alert('用户添加成功！');

      // 重新加载用户列表
      await loadUsers();
      setNewUser({ username: '', email: '', password: '', role: 'editor' });
    } catch (err) {
      console.error('Error adding user:', err);
      setError('添加用户失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser.username || !editingUser.email) {
      setError('用户名和邮箱不能为空');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const userData = {...editingUser};
      
      // 如果密码为空，不更新密码
      if (!userData.password) {
        delete userData.password;
      }
      
      const response = await fetch(`/api/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '更新用户失败');
      }

      // 更新成功提示
      alert('用户信息已更新！');

      // 重新加载用户列表
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      console.error('Error updating user:', err);
      setError('更新用户失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('确定要删除这个用户吗？此操作无法撤销。')) {
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '删除用户失败');
      }

      // 删除成功提示
      alert('用户已成功删除！');

      // 重新加载用户列表
      await loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('删除用户失败: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (user) => {
    setEditingUser({...user, password: ''});
  };

  const cancelEditing = () => {
    setEditingUser(null);
  };

  const handleEditingChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({
      ...editingUser,
      [name]: value
    });
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value
    });
  };

  if (loading && users.length === 0) {
    return (
      <AdminLayout>
        <div className="loading">加载中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="user-page">
        <div className="page-header">
          <h1>用户管理</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <div className="user-form-container">
          <h2>添加新用户</h2>
          <form onSubmit={handleAddUser} className="user-form">
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                type="text"
                id="username"
                name="username"
                value={newUser.username}
                onChange={handleNewUserChange}
                placeholder="输入用户名"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">邮箱</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newUser.email}
                onChange={handleNewUserChange}
                placeholder="输入邮箱"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                type="password"
                id="password"
                name="password"
                value={newUser.password}
                onChange={handleNewUserChange}
                placeholder="输入密码"
                autoComplete="new-password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">角色</label>
              <select
                id="role"
                name="role"
                value={newUser.role}
                onChange={handleNewUserChange}
              >
                <option value="admin">管理员</option>
                <option value="editor">编辑</option>
                <option value="writer">作者</option>
              </select>
            </div>
            <button type="submit" className="btn-submit">添加用户</button>
          </form>
        </div>

        <div className="user-list">
          <h2>现有用户</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>用户名</th>
                <th>邮箱</th>
                <th>角色</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    {editingUser && editingUser.id === user.id ? (
                      <>
                        <td>{user.id}</td>
                        <td>
                          <input
                            type="text"
                            name="username"
                            value={editingUser.username}
                            onChange={handleEditingChange}
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            name="email"
                            value={editingUser.email}
                            onChange={handleEditingChange}
                          />
                        </td>
                        <td>
                          <select
                            name="role"
                            value={editingUser.role}
                            onChange={handleEditingChange}
                          >
                            <option value="admin">管理员</option>
                            <option value="editor">编辑</option>
                            <option value="writer">作者</option>
                          </select>
                        </td>
                        <td>{user.created_at}</td>
                        <td className="actions">
                          <div style={{ marginBottom: '5px' }}>
                            <input
                              type="password"
                              name="password"
                              placeholder="新密码（留空则不修改）"
                              value={editingUser.password || ''}
                              onChange={handleEditingChange}
                              autoComplete="new-password"
                              style={{ width: '100%' }}
                            />
                          </div>
                          <button onClick={handleUpdateUser} className="btn-save">
                            保存
                          </button>
                          <button onClick={cancelEditing} className="btn-cancel">
                            取消
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`role-badge ${user.role}`}>
                            {user.role === 'admin' ? '管理员' : 
                             user.role === 'editor' ? '编辑' : '作者'}
                          </span>
                        </td>
                        <td>{user.created_at}</td>
                        <td className="actions">
                          <button
                            onClick={() => startEditing(user)}
                            className="btn-edit"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="btn-delete"
                            disabled={user.username === 'admin'} // 防止删除管理员
                          >
                            删除
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">暂无用户数据</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserPage; 