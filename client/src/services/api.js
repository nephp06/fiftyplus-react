import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器：添加token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器：處理錯誤
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

// 處理API響應
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || '請求失敗');
  }

  return data;
};

// 認證相關API
export const authApi = {
  login: async (credentials) => {
    return api.post('/auth/login', credentials);
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      console.error('獲取當前用戶信息失敗:', error);
      return { success: false, message: error.message };
    }
  },

  logout: async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = '/admin/login';
  },
};

// 文章相關API
export const articleApi = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/articles?${queryString}`);
    return handleResponse(response);
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    return handleResponse(response);
  },

  create: async (articleData) => {
    const response = await fetch(`${API_BASE_URL}/articles`, {
      method: 'POST',
      headers: {
        Authorization: api.defaults.headers.Authorization,
      },
      body: JSON.stringify(articleData),
    });
    return handleResponse(response);
  },

  update: async (id, articleData) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: api.defaults.headers.Authorization,
      },
      body: JSON.stringify(articleData),
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: api.defaults.headers.Authorization,
      },
    });
    return handleResponse(response);
  },

  getList: async (params) => {
    return api.get('/articles', { params });
  },

  getDetail: async (id) => {
    return api.get(`/articles/${id}`);
  },

  create: async (data) => {
    return api.post('/articles', data);
  },

  update: async (id, data) => {
    return api.put(`/articles/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/articles/${id}`);
  },
};

// 管理面板相關API
export const adminApi = {
  getDashboardData: async () => {
    return api.get('/admin/dashboard');
  },

  getStats: async () => {
    return api.get('/admin/stats');
  },
};

// 分類相關API
export const categoryApi = {
  getAll: async () => {
    return api.get('/categories');
  },

  getById: async (id) => {
    return api.get(`/categories/${id}`);
  },

  create: async (data) => {
    return api.post('/categories', data);
  },

  update: async (id, data) => {
    return api.put(`/categories/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/categories/${id}`);
  },
};

// 上傳相關API
export const uploadApi = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    return api.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteFile: async (filePath) => {
    return api.delete('/upload/file', {
      data: { filePath },
    });
  },
};

export default api;
