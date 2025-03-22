import React, { useState, useEffect } from 'react';
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
  const [previewUrl, setPreviewUrl] = useState(imageUrl);

  // 當props改變時更新狀態
  useEffect(() => {
    setUrl(imageUrl);
    setNewWidth(width);
    setNewHeight(height);
    setPreviewUrl(imageUrl);
    
    // 計算寬高比例
    if (width && height && width > 0 && height > 0) {
      setRatio(height / width);
    }
  }, [imageUrl, width, height, isOpen]);

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
    setPreviewUrl(url);
  };

  // 處理保存
  const handleSave = () => {
    onSave({
      src: url,
      width: newWidth,
      height: newHeight
    });
    onClose();
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
            <img 
              src={previewUrl} 
              alt="預覽" 
              style={{ 
                maxWidth: '100%', 
                maxHeight: '200px', 
                display: previewUrl ? 'block' : 'none' 
              }} 
              onError={() => {
                console.log('圖片載入失敗');
                setPreviewUrl('/assets/images/default-article.svg');
              }}
            />
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
                <button onClick={handlePreview}>預覽</button>
              </div>
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
                  value={newWidth} 
                  onChange={handleWidthChange} 
                  min="1"
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="imageHeight">高度 (px)</label>
                <input 
                  type="number" 
                  id="imageHeight" 
                  value={newHeight} 
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