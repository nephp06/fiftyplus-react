import React, { useState, useEffect } from 'react';
import './UnsplashImage.css';

// 静态图片映射 - 使用可靠的公共CDN
const staticImages = {
  // 人物相关
  person:
    'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=800',
  senior:
    'https://images.pexels.com/photos/34761/old-people-couple-together-connected.jpg?auto=compress&cs=tinysrgb&w=800',
  portrait:
    'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800',
  smile:
    'https://images.pexels.com/photos/1102341/pexels-photo-1102341.jpeg?auto=compress&cs=tinysrgb&w=800',
  success:
    'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=800',
  music:
    'https://images.pexels.com/photos/4709822/pexels-photo-4709822.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 健康相关
  yoga: 'https://images.pexels.com/photos/3822906/pexels-photo-3822906.jpeg?auto=compress&cs=tinysrgb&w=800',
  health:
    'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=800',
  heart:
    'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
  medical:
    'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800',
  meditation:
    'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
  wellness:
    'https://images.pexels.com/photos/4473871/pexels-photo-4473871.jpeg?auto=compress&cs=tinysrgb&w=800',
  nature:
    'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 家庭相关
  family:
    'https://images.pexels.com/photos/1128318/pexels-photo-1128318.jpeg?auto=compress&cs=tinysrgb&w=800',
  home: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800',
  elderly:
    'https://images.pexels.com/photos/7652179/pexels-photo-7652179.jpeg?auto=compress&cs=tinysrgb&w=800',
  estate:
    'https://images.pexels.com/photos/1170412/pexels-photo-1170412.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 舞蹈相关
  dance:
    'https://images.pexels.com/photos/358010/pexels-photo-358010.jpeg?auto=compress&cs=tinysrgb&w=800',
  flamenco:
    'https://images.pexels.com/photos/3156405/pexels-photo-3156405.jpeg?auto=compress&cs=tinysrgb&w=800',
  ballet:
    'https://images.pexels.com/photos/46158/ballet-ballerina-performance-don-quixote-46158.jpeg?auto=compress&cs=tinysrgb&w=800',
  barre:
    'https://images.pexels.com/photos/8963977/pexels-photo-8963977.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 时尚相关
  fashion:
    'https://images.pexels.com/photos/965324/pexels-photo-965324.jpeg?auto=compress&cs=tinysrgb&w=800',
  style:
    'https://images.pexels.com/photos/2703181/pexels-photo-2703181.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 财务相关
  money:
    'https://images.pexels.com/photos/534216/pexels-photo-534216.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 其他类别
  'singing-bowl':
    'https://images.pexels.com/photos/8474600/pexels-photo-8474600.jpeg?auto=compress&cs=tinysrgb&w=800',
  fitness:
    'https://images.pexels.com/photos/4056723/pexels-photo-4056723.jpeg?auto=compress&cs=tinysrgb&w=800',

  // 默认图片
  default:
    'https://images.pexels.com/photos/3768894/pexels-photo-3768894.jpeg?auto=compress&cs=tinysrgb&w=800',
};

const UnsplashImage = ({ category, width, height, alt, className }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    try {
      // 从类别中选择最合适的图片
      const imageUrl = getImageForCategory(category);
      setImageUrl(imageUrl);
    } catch (err) {
      console.error('Error setting image:', err);
      setError(true);
      setImageUrl(
        `https://via.placeholder.com/${width || 800}x${
          height || 600
        }?text=FiftyPlus`
      );
    }

    // 短暂延迟以允许图片加载
    setTimeout(() => setLoading(false), 300);
  }, [category, width, height]);

  // 从类别中选择图片
  const getImageForCategory = (categories) => {
    if (!categories) {
      return staticImages.default;
    }

    // 将类别字符串转换为数组
    const categoryArray = categories.split(',').map((cat) => cat.trim());

    // 尝试找到匹配的类别
    for (const category of categoryArray) {
      if (staticImages[category]) {
        return staticImages[category];
      }
    }

    // 如果没有匹配的类别，返回默认图片
    return staticImages.default;
  };

  const handleImageError = () => {
    console.error(`Image load error for: ${imageUrl}`);
    setError(true);
    setLoading(false);
    // 使用占位图
    setImageUrl(
      `https://via.placeholder.com/${width || 800}x${
        height || 600
      }?text=無法載入圖片`
    );
  };

  return (
    <div
      className={`unsplash-image-container ${className || ''}`}
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {loading && <div className='unsplash-image-loader'></div>}
      {error && !loading && (
        <div className='unsplash-image-error'>無法載入圖片</div>
      )}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={alt || '圖片'}
          className={`unsplash-image ${loading ? 'loading' : 'loaded'}`}
          onLoad={() => setLoading(false)}
          onError={handleImageError}
          loading='lazy'
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}
    </div>
  );
};

export default UnsplashImage;
