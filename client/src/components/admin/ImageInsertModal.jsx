import React, { useState, useRef } from 'react';
import { getImageUrl } from '../../utils/imageUtils';
import './ImageEditorModal.css';

/**
 * 圖片插入模態對話框組件
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - 對話框是否打開
 * @param {function} props.onClose - 關閉對話框的回調
 * @param {function} props.onInsert - 插入圖片的回調，參數為圖片屬性對象
 */
const ImageInsertModal = ({ isOpen, onClose, onInsert }) => {
  const [activeTab, setActiveTab] = useState('url');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [aspectRatio, setAspectRatio] = useState(1);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  // 處理預覽
  const handlePreview = () => {
    if (activeTab === 'url' && imageUrl) {
      setError('');
      // 檢查URL是否是完整URL或是需要通過getImageUrl處理
      if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl(getImageUrl(imageUrl));
      }
    } else if (activeTab === 'file' && imageFile) {
      setError('');
      setPreviewUrl(URL.createObjectURL(imageFile));
    } else {
      setError('請先輸入有效的URL或選擇圖片文件');
      setPreviewUrl('');
    }
  };

  // 處理圖片載入，獲取實際尺寸
  const handleImageLoad = (e) => {
    const img = e.target;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const ratio = imgWidth / imgHeight;

    if (!width && !height) {
      setWidth(imgWidth);
      setHeight(imgHeight);
    }
    setAspectRatio(ratio);
  };

  // 處理寬度變更
  const handleWidthChange = (e) => {
    const newWidth = e.target.value;
    setWidth(newWidth);
    
    if (maintainAspectRatio && newWidth && aspectRatio) {
      setHeight(Math.round(newWidth / aspectRatio));
    }
  };

  // 處理高度變更
  const handleHeightChange = (e) => {
    const newHeight = e.target.value;
    setHeight(newHeight);
    
    if (maintainAspectRatio && newHeight && aspectRatio) {
      setWidth(Math.round(newHeight * aspectRatio));
    }
  };

  // 處理文件選擇
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('請選擇有效的圖片文件');
        setImageFile(null);
        return;
      }

      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      // 清除可能的舊錯誤
      setError('');
    }
  };

  // 處理保存
  const handleInsert = () => {
    if (activeTab === 'url' && !imageUrl) {
      setError('請輸入圖片URL');
      return;
    }
    
    if (activeTab === 'file' && !imageFile) {
      setError('請選擇圖片文件');
      return;
    }
    
    // 創建要返回的對象
    const imageData = {
      type: activeTab,
      width: width ? parseInt(width, 10) : null,
      height: height ? parseInt(height, 10) : null
    };
    
    if (activeTab === 'url') {
      imageData.src = imageUrl;
    } else {
      imageData.file = imageFile;
    }
    
    onInsert(imageData);
    // 關閉對話框
    handleClose();
  };

  // 處理關閉對話框
  const handleClose = () => {
    // 重置所有狀態
    setImageUrl('');
    setImageFile(null);
    setWidth('');
    setHeight('');
    setPreviewUrl('');
    setError('');
    setActiveTab('url');
    // 調用關閉回調
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="image-editor-modal-overlay">
      <div className="image-editor-modal">
        <div className="image-editor-modal-header">
          <h3>插入圖片</h3>
          <button className="close-button" onClick={handleClose}>&times;</button>
        </div>
        <div className="image-editor-modal-body">
          <div className="image-editor-form">
            <div className="form-tabs">
              <button 
                className={`tab-btn ${activeTab === 'url' ? 'active' : ''}`} 
                onClick={() => setActiveTab('url')}
              >
                圖片URL
              </button>
              <button 
                className={`tab-btn ${activeTab === 'file' ? 'active' : ''}`} 
                onClick={() => setActiveTab('file')}
              >
                上傳圖片
              </button>
            </div>

            {error && (
              <div className="error-message" style={{
                color: '#721c24',
                backgroundColor: '#f8d7da',
                padding: '10px 15px',
                borderRadius: '4px',
                marginBottom: '15px'
              }}>
                {error}
              </div>
            )}

            {activeTab === 'url' && (
              <div className="form-group">
                <label htmlFor="imageUrl">圖片URL</label>
                <div className="url-input-group">
                  <input 
                    type="text"
                    id="imageUrl" 
                    value={imageUrl} 
                    onChange={(e) => setImageUrl(e.target.value)} 
                    placeholder="輸入圖片URL"
                  />
                  <button type="button" onClick={handlePreview}>預覽</button>
                </div>
                <div className="url-note">
                  提示：您可以輸入完整URL（如 https://example.com/image.jpg）或相對路徑
                </div>
              </div>
            )}

            {activeTab === 'file' && (
              <div className="form-group">
                <label htmlFor="localImage">選擇本地圖片</label>
                <input 
                  type="file"
                  id="localImage" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {previewUrl && (
              <>
                <div className="image-editor-preview">
                  <img 
                    src={previewUrl} 
                    alt="預覽" 
                    style={{ 
                      maxWidth: '100%', 
                      maxHeight: '200px'
                    }} 
                    onError={(e) => {
                      console.log('圖片載入失敗');
                      e.target.src = '/assets/images/default-article.svg';
                    }}
                    onLoad={handleImageLoad}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="keepRatio">
                    <input 
                      type="checkbox" 
                      id="keepRatio" 
                      checked={maintainAspectRatio} 
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)} 
                    />
                    保持寬高比例
                  </label>
                </div>
                
                <div className="dimensions-group">
                  <div className="form-group">
                    <label htmlFor="imageWidth">寬度 (px)</label>
                    <input 
                      type="number" 
                      id="imageWidth" 
                      value={width} 
                      onChange={handleWidthChange} 
                      min="1"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="imageHeight">高度 (px)</label>
                    <input 
                      type="number" 
                      id="imageHeight" 
                      value={height} 
                      onChange={handleHeightChange} 
                      min="1"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="image-editor-modal-footer">
          <button className="cancel-button" onClick={handleClose}>取消</button>
          <button 
            className="save-button" 
            onClick={handleInsert}
            disabled={!previewUrl}
          >
            插入圖片
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageInsertModal; 