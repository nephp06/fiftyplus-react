import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { articleApi } from '../../services/api';
import ImageUploader from '../../components/admin/ImageUploader';
import ImageEditorModal from '../../components/admin/ImageEditorModal';
import ImageInsertModal from '../../components/admin/ImageInsertModal';
import AdminLayout from '../../layouts/AdminLayout/AdminLayout';
import { getImageUrl } from '../../utils/imageUtils';
import './ArticleEditPage.css';

// 導入圖片調整模塊
import ImageResize from 'quill-image-resize-module-react';

// 註冊Quill模塊
if (typeof window !== 'undefined') {
  const Quill = ReactQuill.Quill;
  
  // 擴展Quill的白名單，允許圖片的width和height屬性
  const Image = Quill.import('formats/image');
  // 添加需要保留的屬性到白名單
  Image.sanitize = function(url) {
    return url;
  };
  Image.formats = function(domNode) {
    return {
      src: domNode.getAttribute('src'),
      width: domNode.getAttribute('width'),
      height: domNode.getAttribute('height')
    };
  };
  Quill.register(Image, true);
  
  // 註冊resize模塊
  Quill.register('modules/imageResize', ImageResize);
  
  // 創建自定義圖片處理模塊
  class CustomImageHandler {
    constructor(quill) {
      this.quill = quill;
      
      // 取得工具欄按鈕並綁定事件
      const toolbar = quill.getModule('toolbar');
      toolbar.addHandler('image', this.selectImage.bind(this));
    }
    
    selectImage() {
      // 創建一個對話框詢問用戶選擇上傳還是 URL 插入
      const selection = this.quill.getSelection();
      if (!selection) return;
      
      const urlInput = window.prompt('請輸入圖片URL，或點擊取消使用本地上傳:', '');
      
      if (urlInput) {
        this.insertImage(urlInput, selection);
      } else {
        // 如果用戶點擊取消，觸發原生的文件選擇對話框
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();
        
        input.onchange = () => {
          if (input.files && input.files[0]) {
            // 將上傳處理邏輯保留給原生處理
            const fileInput = input;
            // 觸發此元素上的點擊事件，以便讓 Quill 原生處理上傳
            this.quill.getModule('toolbar').handlers.image.call(this.quill, fileInput);
          }
        };
      }
    }
    
    insertImage(url, range) {
      // 插入圖片到編輯器
      const quill = this.quill;
      
      // 處理相對路徑轉換為完整 URL
      const displayUrl = url.startsWith('http') || url.startsWith('/') ? url : getImageUrl(url);
      
      // 保存當前選區
      quill.setSelection(range.index, range.length);
      
      // 在當前位置插入圖片
      quill.insertEmbed(range.index, 'image', displayUrl, 'user');
      
      // 將光標移動到圖片後面
      quill.setSelection(range.index + 1, 0);
    }
  }

  // 註冊自定義模塊
  Quill.register('modules/customImageHandler', CustomImageHandler);
}

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
  
  // 添加圖片編輯對話框相關狀態
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState({
    element: null,
    src: '',
    width: '',
    height: ''
  });
  
  // 添加圖片插入對話框狀態
  const [isInsertModalOpen, setIsInsertModalOpen] = useState(false);
  const [insertPosition, setInsertPosition] = useState(null);
  
  // 封面圖片編輯相關狀態
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverImageSize, setCoverImageSize] = useState({ width: '', height: '' });

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

  // 圖片點擊處理器
  useEffect(() => {
    if (quillRef.current && !loading) {
      const editor = quillRef.current.getEditor();
      if (editor) {
        // 為編輯器內容區添加點擊事件監聽
        const handleImageClick = (e) => {
          // 檢查點擊的是否為圖片元素
          if (e.target && e.target.tagName === 'IMG') {
            const img = e.target;
            
            // 設置當前編輯的圖片
            setCurrentImage({
              element: img,
              src: img.getAttribute('src'),
              width: img.style.width || img.width,
              height: img.style.height || img.height
            });
            
            // 打開編輯對話框
            setIsModalOpen(true);
          }
        };
        
        // 添加事件監聽器
        editor.root.addEventListener('click', handleImageClick);
        
        // 在組件清理時移除事件監聽器
        return () => {
          editor.root.removeEventListener('click', handleImageClick);
        };
      }
    }
  }, [loading, quillRef.current]);

  // 覆寫 Quill 默認的圖片處理
  useEffect(() => {
    if (quillRef.current && !loading) {
      const editor = quillRef.current.getEditor();
      if (editor) {
        // 獲取工具欄
        const toolbar = editor.getModule('toolbar');
        if (toolbar) {
          // 覆寫圖片處理函數
          toolbar.addHandler('image', () => {
            // 獲取當前選擇區域
            const range = editor.getSelection();
            setInsertPosition(range);
            // 打開圖片插入對話框
            setIsInsertModalOpen(true);
          });
        }
      }
    }
  }, [loading, quillRef.current]);

  // 處理圖片插入
  const handleImageInsert = (imageData) => {
    if (!quillRef.current || !insertPosition) return;
    
    const editor = quillRef.current.getEditor();
    
    if (imageData.type === 'url') {
      // 處理網絡圖片插入
      let displayUrl = imageData.src;
      
      // 如果不是以 http 或 / 開頭，則使用 getImageUrl 處理
      if (!displayUrl.startsWith('http') && !displayUrl.startsWith('/')) {
        displayUrl = getImageUrl(displayUrl);
      }
      
      // 在選擇的位置插入圖片
      editor.insertEmbed(insertPosition.index, 'image', displayUrl, 'user');
      
      // 如果有設置寬度和高度
      if (imageData.width || imageData.height) {
        // 獲取插入的圖片元素
        setTimeout(() => {
          const imgs = editor.root.querySelectorAll('img');
          // 找到剛剛插入的圖片
          for (let i = imgs.length - 1; i >= 0; i--) {
            const img = imgs[i];
            if (img.getAttribute('src') === displayUrl) {
              // 設置尺寸
              if (imageData.width) {
                img.setAttribute('width', imageData.width);
                img.style.width = `${imageData.width}px`;
              }
              if (imageData.height) {
                img.setAttribute('height', imageData.height);
                img.style.height = `${imageData.height}px`;
              }
              break;
            }
          }
          
          // 保存內容變更
          handleContentChange(editor.root.innerHTML);
        }, 50);
      }
      
      // 移動光標到圖片後
      editor.setSelection(insertPosition.index + 1, 0);
    } else if (imageData.type === 'file' && imageData.file) {
      // 處理本地文件上傳
      // 使用現有的上傳處理邏輯
      const formData = new FormData();
      formData.append('image', imageData.file);
      
      // 顯示臨時圖片
      const tempUrl = URL.createObjectURL(imageData.file);
      editor.insertEmbed(insertPosition.index, 'image', tempUrl, 'user');
      
      // 移動光標到圖片後
      editor.setSelection(insertPosition.index + 1, 0);
      
      // 上傳圖片到服務器
      fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // 上傳成功，替換臨時圖片為服務器圖片
          const imgs = editor.root.querySelectorAll('img');
          // 找到臨時圖片
          for (let i = imgs.length - 1; i >= 0; i--) {
            const img = imgs[i];
            if (img.getAttribute('src') === tempUrl) {
              // 替換圖片源
              const serverUrl = getImageUrl(data.data.imageUrl);
              img.setAttribute('src', serverUrl);
              
              // 設置尺寸
              if (imageData.width) {
                img.setAttribute('width', imageData.width);
                img.style.width = `${imageData.width}px`;
              }
              if (imageData.height) {
                img.setAttribute('height', imageData.height);
                img.style.height = `${imageData.height}px`;
              }
              break;
            }
          }
          
          // 釋放臨時URL
          URL.revokeObjectURL(tempUrl);
          
          // 保存內容變更
          handleContentChange(editor.root.innerHTML);
        } else {
          console.error('上傳圖片失敗:', data.message);
          // 顯示錯誤消息
          setError(`上傳圖片失敗: ${data.message}`);
        }
      })
      .catch(err => {
        console.error('上傳圖片時發生錯誤:', err);
        setError(`上傳圖片時發生錯誤: ${err.message}`);
      });
    }
  };

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
    
    // 獲取並保存上傳圖片的尺寸
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        setCoverImageSize({
          width: img.width,
          height: img.height
        });
        console.log('上傳圖片尺寸:', img.width, 'x', img.height);
      };
      img.src = getImageUrl(imageUrl);
    }
  };

  const handleImageError = (error) => {
    setError(`图片上传失败: ${error}`);
  };

  // 處理封面圖片更新
  const handleCoverImageUpdate = (imageData) => {
    if (imageData.src) {
      setArticle(prev => ({
        ...prev,
        coverImage: imageData.src
      }));
      
      // 保存圖片尺寸信息，用於後續使用
      setCoverImageSize({
        width: imageData.width,
        height: imageData.height
      });
    }
  };

  // 打開封面圖片編輯對話框
  const openCoverImageEditor = () => {
    // 在打開對話框前先獲取圖片尺寸
    if (article.coverImage) {
      const img = new Image();
      img.onload = () => {
        console.log('獲取封面圖片尺寸成功:', img.width, 'x', img.height);
        setCoverImageSize({
          width: img.width,
          height: img.height
        });
        // 設置尺寸後再打開對話框
        setIsCoverModalOpen(true);
      };
      img.onerror = () => {
        console.error('獲取封面圖片尺寸失敗');
        // 即使獲取失敗也打開對話框
        setIsCoverModalOpen(true);
      };
      img.src = getImageUrl(article.coverImage);
    } else {
      setIsCoverModalOpen(true);
    }
  };

  // 處理圖片更新
  const handleImageUpdate = (imageData) => {
    if (currentImage.element && quillRef.current) {
      const img = currentImage.element;
      const editor = quillRef.current.getEditor();
      
      // 更新圖片屬性
      if (imageData.src) {
        img.setAttribute('src', imageData.src);
      }
      
      // 確保明確設置寬度和高度，而不是使用樣式
      if (imageData.width) {
        img.removeAttribute('width');  // 先移除舊的原生width屬性
        img.style.width = `${imageData.width}px`;
        // 同時設置HTML的width屬性，確保保存
        img.setAttribute('width', imageData.width);
      }
      
      if (imageData.height) {
        img.removeAttribute('height');  // 先移除舊的原生height屬性
        img.style.height = `${imageData.height}px`;
        // 同時設置HTML的height屬性，確保保存
        img.setAttribute('height', imageData.height);
      }
      
      // 強制觸發更新，確保編輯器內容已經被修改
      setTimeout(() => {
        // 觸發內容變化，確保更新保存到狀態
        console.log('更新圖片尺寸:', imageData.width, imageData.height);
        handleContentChange(editor.root.innerHTML);
      }, 50);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // 確保圖片尺寸設置被保存
      let processedContent = article.content;
      if (quillRef.current) {
        // 查找所有帶有樣式寬度/高度的圖片，確保它們同時具有width/height屬性
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = article.content;
        const images = tempDiv.querySelectorAll('img');
        
        let contentChanged = false;
        images.forEach(img => {
          // 從style樣式中提取寬度和高度
          const style = img.getAttribute('style') || '';
          const widthMatch = style.match(/width:\s*(\d+)px/);
          const heightMatch = style.match(/height:\s*(\d+)px/);
          
          if (widthMatch && !img.hasAttribute('width')) {
            img.setAttribute('width', widthMatch[1]);
            contentChanged = true;
          }
          
          if (heightMatch && !img.hasAttribute('height')) {
            img.setAttribute('height', heightMatch[1]);
            contentChanged = true;
          }
        });
        
        if (contentChanged) {
          processedContent = tempDiv.innerHTML;
          // 更新article狀態中的content
          setArticle(prev => ({
            ...prev,
            content: processedContent
          }));
        }
      }
      
      console.log('提交文章数据:', article);
      
      const token = localStorage.getItem('token');
      const formData = {
        title: article.title,
        content: processedContent, // 使用處理後的內容
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
          ],
          // 添加圖片調整模塊
          imageResize: {
            // 使用基本配置避免複雜設置導致錯誤
            modules: ['Resize', 'DisplaySize'],
            handleStyles: {
              backgroundColor: 'black',
              border: 'none',
              color: 'white'
            }
          },
          clipboard: {
            // 允許所有HTML標籤和屬性
            matchVisual: false
          },
          // 添加我們的自定義圖片處理模塊
          customImageHandler: true
        }}
        formats={[
          'header',
          'bold', 'italic', 'underline', 'strike',
          'list', 'bullet',
          'link', 'image',
          'width', 'height', 'style' // 添加寬度和高度格式
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
                    style={{ cursor: 'pointer' }}
                    onClick={openCoverImageEditor}
                    onError={(e) => {
                      console.log('圖片載入失敗，路徑:', e.target.src);
                      e.target.onerror = null;
                      e.target.src = '/assets/images/default-article.svg';
                    }}
                  />
                  <div style={{marginTop: "5px", fontSize: "12px", color: "#666"}}>
                    圖片原始路徑: {article.coverImage}<br/>
                    圖片顯示路徑: {getImageUrl(article.coverImage)}
                    <button 
                      type="button" 
                      className="edit-cover-btn"
                      onClick={openCoverImageEditor}
                    >
                      編輯封面圖片
                    </button>
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

        {/* 圖片編輯對話框 */}
        <ImageEditorModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleImageUpdate}
          imageUrl={currentImage.src}
          width={currentImage.width}
          height={currentImage.height}
        />
        
        {/* 封面圖片編輯對話框 */}
        <ImageEditorModal 
          isOpen={isCoverModalOpen}
          onClose={() => setIsCoverModalOpen(false)}
          onSave={handleCoverImageUpdate}
          imageUrl={article.coverImage}
          width={coverImageSize.width}
          height={coverImageSize.height}
        />

        {/* 圖片插入對話框 */}
        <ImageInsertModal 
          isOpen={isInsertModalOpen}
          onClose={() => setIsInsertModalOpen(false)}
          onInsert={handleImageInsert}
        />
      </div>
    </AdminLayout>
  );
};

export default ArticleEditPage; 