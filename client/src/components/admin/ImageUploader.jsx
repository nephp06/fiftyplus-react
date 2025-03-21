import React, { useState, useRef } from 'react';
import { uploadApi } from '../../services/api';
import './ImageUploader.css';

const ImageUploader = ({ onUploadSuccess, onUploadError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileUpload = async (file) => {
    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      onUploadError?.('只能上传图片文件');
      return;
    }

    // 检查文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.('图片大小不能超过5MB');
      return;
    }

    try {
      setIsUploading(true);
      // 创建预览
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);

      // 上传文件
      const response = await uploadApi.uploadImage(file);
      onUploadSuccess?.(response.data);
    } catch (error) {
      onUploadError?.(error.message);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className={`image-uploader ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {preview ? (
        <div className="preview-container">
          <img src={preview} alt="预览" className="image-preview" />
          <button 
            className="remove-preview"
            onClick={() => {
              setPreview(null);
              fileInputRef.current.value = '';
            }}
          >
            ×
          </button>
        </div>
      ) : (
        <div 
          className="upload-placeholder"
          onClick={() => fileInputRef.current.click()}
        >
          {isUploading ? (
            <div className="uploading">
              <div className="spinner"></div>
              <span>上传中...</span>
            </div>
          ) : (
            <>
              <i className="fas fa-cloud-upload-alt"></i>
              <p>点击或拖拽图片到此处上传</p>
              <p className="upload-hint">支持 JPG、PNG、GIF、WebP 格式，最大5MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader; 