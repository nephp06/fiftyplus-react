import React, { useState, useEffect } from 'react';
import { getImageUrl } from '../../utils/imageUtils';
import './ImageEditorModal.css';

/**
 * 圖片編輯模態對話框組件
 * 
 * @param {object} props
 * @param {boolean} props.isOpen - 對話框是否打開
 * @param {function} props.onClose - 關閉對話框的回調
 * @param {function} props.onSave - 保存修改的回調，參數為更新後的圖片屬性對象
 * @param {string} props.imageUrl - 圖片URL
 * @param {number} props.width - 圖片寬度
 * @param {number} props.height - 圖片高度
 */
const ImageEditorModal = ({ isOpen, onClose, onSave, imageUrl = '', width = '', height = '' }) => {
  const [url, setUrl] = useState(imageUrl);
  const [newWidth, setNewWidth] = useState(width);
  const [newHeight, setNewHeight] = useState(height);
  const [keepRatio, setKeepRatio] = useState(true);
  const [ratio, setRatio] = useState(1);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isOriginalUrl, setIsOriginalUrl] = useState(true);

  // 當props改變時更新狀態
  useEffect(() => {
    // 設置URL，如果是相對路徑使用getImageUrl處理
    if (imageUrl) {
      // 保存原始的URL
      setUrl(imageUrl);
      // 用於預覽的URL可能需要轉換
      const displayUrl = getImageUrl(imageUrl);
      setPreviewUrl(displayUrl);
      // 檢查URL是否為完整URL或相對路徑
      setIsOriginalUrl(!imageUrl.startsWith('http') && !imageUrl.startsWith('/'));
      
      // 如果沒有提供寬度或高度，嘗試從圖片獲取
      if ((!width || !height) && isOpen) {
        const img = new Image();
        img.onload = () => {
          console.log('自動獲取圖片尺寸:', img.width, 'x', img.height);
          if (!width) setNewWidth(img.width);
          if (!height) setNewHeight(img.height);
          // 更新比例
          if (img.width > 0 && img.height > 0) {
            setRatio(img.height / img.width);
          }
        };
        img.onerror = () => {
          console.error('無法加載圖片以獲取尺寸:', displayUrl);
        };
        img.src = displayUrl;
      }
    } else {
      setPreviewUrl('');
    }
    
    // 如果有提供寬度和高度，則使用提供的值
    if (width) setNewWidth(width);
    if (height) setNewHeight(height);
    
    // 計算寬高比例（如果都有值）
    if (width && height && width > 0 && height > 0) {
      setRatio(height / width);
    }
  }, [imageUrl, width, height, isOpen]);

  // 添加調試日誌，檢查props
  useEffect(() => {
    if (isOpen) {
      console.log('ImageEditorModal開啟，接收到的尺寸:', { 
        imageUrl, 
        width: width || '未提供', 
        height: height || '未提供' 
      });
    }
  }, [isOpen, imageUrl, width, height]);

  // 處理寬度變化，如果保持比例則同時更新高度
  const handleWidthChange = (e) => {
    const w = e.target.value;
    setNewWidth(w);
    
    if (keepRatio && w && !isNaN(parseInt(w))) {
      const calculatedHeight = Math.round(parseInt(w) * ratio);
      setNewHeight(calculatedHeight);
    }
  };

  // 處理高度變化，如果保持比例則同時更新寬度
  const handleHeightChange = (e) => {
    const h = e.target.value;
    setNewHeight(h);
    
    if (keepRatio && h && !isNaN(parseInt(h))) {
      const calculatedWidth = Math.round(parseInt(h) / ratio);
      setNewWidth(calculatedWidth);
    }
  };

  // 處理URL預覽
  const handlePreview = () => {
    // 檢查URL是否為http開頭的完整URL
    if (url.startsWith('http') || url.startsWith('/')) {
      setPreviewUrl(url);
    } else {
      // 如果是相對路徑，使用getImageUrl處理
      setPreviewUrl(getImageUrl(url));
    }
  };

  // 處理保存
  const handleSave = () => {
    // 確保尺寸值為數字
    const widthValue = newWidth ? parseInt(newWidth) : null;
    const heightValue = newHeight ? parseInt(newHeight) : null;
    
    console.log('保存圖片尺寸:', widthValue, 'x', heightValue);
    
    onSave({
      src: url,
      width: widthValue,
      height: heightValue
    });
    onClose();
  };

  // 當圖片加載完成時獲取實際尺寸
  const handleImageLoad = (e) => {
    const img = e.target;
    console.log('圖片加載完成，實際尺寸:', img.naturalWidth, 'x', img.naturalHeight);
    
    // 如果尺寸未設置，則使用圖片的自然尺寸
    if (!newWidth || newWidth === '') {
      setNewWidth(img.naturalWidth);
    }
    
    if (!newHeight || newHeight === '') {
      setNewHeight(img.naturalHeight);
    }
    
    // 更新比例
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setRatio(img.naturalHeight / img.naturalWidth);
    }
  };

  // 格式化顯示的寬度和高度值
  const formatDimension = (value) => {
    if (value === null || value === undefined || value === '') return '';
    return parseInt(value);
  };

  // 如果對話框未打開，不渲染任何內容
  if (!isOpen) return null;

  return (
    <div className="image-editor-modal-overlay">
      <div className="image-editor-modal">
        <div className="image-editor-modal-header">
          <h3>編輯圖片</h3>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="image-editor-modal-body">
          <div className="image-editor-preview">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="預覽" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '200px', 
                  width: newWidth ? `${newWidth}px` : 'auto',
                  height: newHeight ? `${newHeight}px` : 'auto'
                }} 
                onError={(e) => {
                  console.log('圖片載入失敗');
                  e.target.src = '/assets/images/default-article.svg';
                }}
                onLoad={handleImageLoad}
              />
            ) : (
              <p>無預覽圖片</p>
            )}
          </div>
          
          <div className="image-editor-form">
            <div className="form-group">
              <label htmlFor="imageUrl">圖片URL</label>
              <div className="url-input-group">
                <input 
                  type="text" 
                  id="imageUrl" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)} 
                  placeholder="輸入圖片URL"
                />
                <button type="button" onClick={handlePreview}>預覽</button>
              </div>
              {isOriginalUrl && (
                <div className="url-note">
                  當前顯示URL: {previewUrl || '無'}
                </div>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="keepRatio">
                <input 
                  type="checkbox" 
                  id="keepRatio" 
                  checked={keepRatio} 
                  onChange={(e) => setKeepRatio(e.target.checked)} 
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
                  value={formatDimension(newWidth)} 
                  onChange={handleWidthChange} 
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="imageHeight">高度 (px)</label>
                <input 
                  type="number" 
                  id="imageHeight" 
                  value={formatDimension(newHeight)} 
                  onChange={handleHeightChange} 
                  min="1"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="image-editor-modal-footer">
          <button className="cancel-button" onClick={onClose}>取消</button>
          <button className="save-button" onClick={handleSave}>保存</button>
        </div>
      </div>
    </div>
  );
};

export default ImageEditorModal; 