import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { articleApi } from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { getImageUrl } from '../../utils/imageUtils';
import './ArticleEditPage.css';

const ArticleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    content: '',
    category: 'news',
    coverImage: '',
    summary: '',
    tags: [],
    status: 'draft'
  });
  const [error, setError] = useState('');
  const quillRef = useRef(null);
  const [quillLoaded, setQuillLoaded] = useState(false);

  useEffect(() => {
    if (id) {
      loadArticle();
    }
    
    // 组件卸载时清理Quill编辑器
    return () => {
      if (quillRef.current) {
        const editor = quillRef.current.getEditor();
        if (editor) {
          editor.off();
        }
      }
    };
  }, [id]);

  useEffect(() => {
    // 确保编辑器在加载后能正常工作
    if (quillRef.current && !loading) {
      const editor = quillRef.current.getEditor();
      if (editor) {
        // 延迟一下，确保Quill已完全初始化
        setTimeout(() => {
          // 触发一个编辑器焦点，确保它能够响应编辑
          editor.focus();
          // 将光标移到末尾
          editor.setSelection(editor.getLength(), 0);
        }, 200);
      }
    }
  }, [loading, quillRef.current]);

  useEffect(() => {
    // 确保在客户端环境下渲染ReactQuill
    setQuillLoaded(true);
  }, []);

  const loadArticle = async () => {
    try {
      setLoading(true);
      console.log('正在加载文章ID:', id);
      const token = localStorage.getItem('token');
      
      console.log('使用令牌:', token ? '已获取令牌' : '未获取令牌'); 
      
      const response = await fetch(`/api/admin/articles/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('API响应状态:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误响应:', errorText);
        throw new Error(`API返回错误: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('文章数据:', data);
      
      if (data && data.success) {
        // 处理数据适配
        const articleData = data.data;
        
        let coverImage = '';
        // 处理封面图片URL
        if (articleData.coverImage) {
          coverImage = articleData.coverImage;
        } else if (articleData.image_url) {
          coverImage = articleData.image_url;
        }
        
        setArticle({
          title: articleData.title || '',
          content: articleData.content || '',
          category: articleData.category || 'news',
          coverImage: coverImage,
          summary: articleData.summary || '',
          tags: articleData.tags || [],
          status: articleData.status || 'draft'
        });
        
        console.log('处理后的文章数据:', {
          title: articleData.title,
          coverImage: coverImage,
          contentLength: articleData.content ? articleData.content.length : 0,
          summary: articleData.summary,
          tags: articleData.tags
        });
      } else {
        throw new Error(data.message || '获取文章数据失败');
      }
    } catch (err) {
      console.error('加载文章错误:', err);
      setError(`加载文章失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content) => {
    console.log('Content changed:', content);
    setArticle(prev => ({
      ...prev,
      content
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setArticle(prev => ({
      ...prev,
      tags
    }));
  };

  const handleImageUpload = (data) => {
    console.log('上传图片成功，返回数据:', data);
    const imageUrl = data.url;
    console.log('設置的圖片URL:', imageUrl);
    setArticle(prev => ({
      ...prev,
      coverImage: imageUrl
    }));
  };

  const handleImageError = (error) => {
    setError(`图片上传失败: ${error}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('提交文章数据:', article);
      
      const token = localStorage.getItem('token');
      const formData = {
        title: article.title,
        content: article.content,
        summary: article.summary,
        tags: article.tags,
        category: article.category,
        image_url: article.coverImage,
        status: article.status || 'published'
      };
      
      console.log('准备发送的数据:', formData);
      
      let response;
      if (id) {
        // 更新文章
        response = await fetch(`/api/articles/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      } else {
        // 创建新文章
        response = await fetch('/api/articles', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API错误响应:', errorText);
        throw new Error(`API返回错误: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('API响应:', data);
      
      if (data && data.success) {
        navigate('/admin/articles');
      } else {
        throw new Error(data.message || '保存文章失败');
      }
    } catch (err) {
      setError(`保存文章失败: ${err.message}`);
      console.error('保存文章错误:', err);
    } finally {
      setLoading(false);
    }
  };

  // 在内容部分渲染React-Quill或替代内容
  const renderEditor = () => {
    if (!quillLoaded) {
      return <div className="loading-editor">正在加载编辑器...</div>;
    }
    
    return (
      <ReactQuill
        ref={quillRef}
        value={article.content}
        onChange={handleContentChange}
        theme="snow"
        style={{ height: '350px' }}
        modules={{
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }}
        formats={[
          'header',
          'bold', 'italic', 'underline', 'strike',
          'list', 'bullet',
          'link', 'image'
        ]}
        placeholder="请输入文章内容..."
      />
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading">加载中...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="article-edit-page">
        <div className="page-header">
          <h1>{id ? '编辑文章' : '创建文章'}</h1>
        </div>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">标题</label>
            <input
              type="text"
              id="title"
              name="title"
              value={article.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="summary">摘要</label>
            <textarea
              id="summary"
              name="summary"
              value={article.summary}
              onChange={handleInputChange}
              rows="3"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">分类</label>
            <select
              id="category"
              name="category"
              value={article.category}
              onChange={handleInputChange}
            >
              <option value="news">新闻</option>
              <option value="people">人物</option>
              <option value="culture">文化</option>
              <option value="lifestyle">生活方式</option>
            </select>
          </div>

          <div className="form-group">
            <label>封面图片</label>
            <ImageUploader
              onUploadSuccess={handleImageUpload}
              onUploadError={handleImageError}
            />
            <div className="cover-preview-container">
              {article.coverImage ? (
                <>
                  <img 
                    src={getImageUrl(article.coverImage)}
                    alt="封面預覽" 
                    className="cover-preview" 
                    onError={(e) => {
                      console.log('圖片載入失敗，路徑:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = '/assets/images/default-article.svg';
                    }}
                  />
                  <div style={{marginTop: "5px", fontSize: "12px", color: "#666"}}>
                    圖片原始路徑: {article.coverImage}<br/>
                    圖片顯示路徑: {getImageUrl(article.coverImage)}
                  </div>
                </>
              ) : (
                <div className="empty-preview">
                  <p>尚未上傳封面圖片</p>
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">标签（用逗号分隔）</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={article.tags.join(', ')}
              onChange={handleTagsChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="content">内容</label>
            <div className="editor-container" style={{ height: '400px', marginBottom: '20px' }}>
              {renderEditor()}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="status">状态</label>
            <select
              id="status"
              name="status"
              value={article.status}
              onChange={handleInputChange}
            >
              <option value="draft">草稿</option>
              <option value="published">发布</option>
            </select>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={() => navigate('/admin/articles')}
              className="btn-cancel"
            >
              取消
            </button>
            <button 
              type="submit" 
              className="btn-submit"
              disabled={loading}
            >
              {loading ? '保存中...' : '保存'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default ArticleEditPage; 