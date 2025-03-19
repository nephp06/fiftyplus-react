import React, { useState, useEffect } from 'react';
import { getFallbackImage, formatUnsplashUrl } from '../utils/imageUtils';
import './UnsplashImage.css';

const UnsplashImage = ({ category, width, height, alt, className }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        setError(false);

        // 首先尝试使用source.unsplash.com API
        try {
          const baseUrl = 'https://source.unsplash.com/random';
          const size = `${width || 800}x${height || 600}`;
          const query = category ? `?${category}` : '';
          const unsplashUrl = `${baseUrl}/${size}${query}`;

          const response = await fetch(unsplashUrl, { method: 'GET' });
          if (response.ok) {
            setImageUrl(response.url);
            return;
          }
        } catch (e) {
          console.warn(
            'Failed to fetch from source.unsplash.com, using fallback',
            e
          );
        }

        // 如果API不可用，使用备用图片
        const fallbackUrl = getFallbackImage(category);
        const formattedUrl = formatUnsplashUrl(fallbackUrl, width, height);
        setImageUrl(formattedUrl);
      } catch (err) {
        console.error('Error loading Unsplash image:', err);
        setError(true);
        // 最后的备用方案：使用placeholder服务
        setImageUrl(
          `https://via.placeholder.com/${width || 800}x${
            height || 600
          }?text=FiftyPlus`
        );
      } finally {
        // 短暂延迟以允许图片加载
        setTimeout(() => setLoading(false), 300);
      }
    };

    fetchImage();
  }, [category, width, height]);

  return (
    <div
      className={`unsplash-image-container ${className || ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {loading && <div className='unsplash-image-loader'></div>}
      {error && <div className='unsplash-image-error'>無法載入圖片</div>}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt || '圖片'}
          className={`unsplash-image ${loading ? 'loading' : 'loaded'}`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          loading='lazy'
        />
      )}
    </div>
  );
};

export default UnsplashImage;
