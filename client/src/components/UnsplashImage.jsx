import React, { useState, useEffect } from 'react';
import './UnsplashImage.css';

// Unsplash图片映射
const unsplashImages = {
  // 人物相关
  person: 'https://images.unsplash.com/photo-1557804506-669a67965ba0',
  senior: 'https://images.unsplash.com/photo-1581579438747-104c53d7fbc4',
  portrait: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04',
  smile: 'https://images.unsplash.com/photo-1560998268-08e13b3d199a',
  success: 'https://images.unsplash.com/photo-1484807352052-23338990c6c6',
  music: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4',
  entrepreneur: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21',
  marathon: 'https://images.unsplash.com/photo-1594882645126-14020914d58d',
  career: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0',

  // 健康相关
  yoga: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597',
  health: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7',
  heart: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528',
  medical: 'https://images.unsplash.com/photo-1581595219315-a187dd40c322',
  meditation: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
  wellness: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
  nature: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
  knee: 'https://images.unsplash.com/photo-1562414963-4132cb247a10',
  strength: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e',
  nutrition: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061',
  walking: 'https://images.unsplash.com/photo-1483721310020-03333e577078',

  // 家庭相关
  family: 'https://images.unsplash.com/photo-1511895426328-dc8714191300',
  home: 'https://images.unsplash.com/photo-1513694203232-719a280e022f',
  elderly: 'https://images.unsplash.com/photo-1522075782449-e45a34f1ddfb',
  estate: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716',
  emptyNest: 'https://images.unsplash.com/photo-1486304873000-235643847519',
  
  // 心理健康相关
  mentalHealth: 'https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81',

  // 舞蹈相关
  dance: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
  flamenco: 'https://images.unsplash.com/photo-1563181961424-a3bbdb78bea5',
  ballet: 'https://images.unsplash.com/photo-1518834107812-67b0b7c58434',
  barre: 'https://images.unsplash.com/photo-1518095695064-1facc851434e',

  // 时尚相关
  fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
  style: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb',

  // 财务相关
  money: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e',
  finance: 'https://images.unsplash.com/photo-1565514020179-026b92b4a0b9',
  retirement: 'https://images.unsplash.com/photo-1527358493566-389d15eb1a9e',

  // 生活相关
  travel: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b',
  technology: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
  social: 'https://images.unsplash.com/photo-1536683402757-75c7a3972764',
  community: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
  smartphone: 'https://images.unsplash.com/photo-1570101945621-945409a6370f',

  // 其他类别
  'singing-bowl': 'https://images.unsplash.com/photo-1539344388786-44bd1c0a3220',
  fitness: 'https://images.unsplash.com/photo-1518611012118-696072aa579a',
  sustainability: 'https://images.unsplash.com/photo-1535016120720-40c646be5580',

  // 默认图片
  default: 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17'
};

const UnsplashImage = ({ category, width, height, alt, className }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);

    try {
      // 从类别中查找Unsplash图片
      const baseImageUrl = getUnsplashImageForCategory(category);

      // 添加尺寸和质量参数
      const formattedUrl = `${baseImageUrl}?w=${width || 800}&h=${
        height || 600
      }&q=80&auto=format&fit=crop`;

      setImageUrl(formattedUrl);
    } catch (err) {
      console.error('Error setting image:', err);
      setError(true);
      // 使用占位图作为备用
      setImageUrl(`https://placehold.co/${width || 800}x${height || 600}/gray/white?text=HeartWise`);
    }

    // 短暂延迟以允许图片加载
    setTimeout(() => setLoading(false), 300);
  }, [category, width, height]);

  // 从类别映射中获取Unsplash图片URL
  const getUnsplashImageForCategory = (categories) => {
    if (!categories) return unsplashImages.default;

    // 将类别字符串拆分为数组
    const categoryArray = categories.split(',').map((cat) => cat.trim());

    // 查找匹配的类别图片
    for (const cat of categoryArray) {
      if (unsplashImages[cat]) {
        return unsplashImages[cat];
      }
    }

    // 如果没有匹配项，返回默认图片
    return unsplashImages.default;
  };

  const handleImageError = () => {
    console.error(`Image load error for: ${imageUrl}`);
    setError(true);
    setLoading(false);

    // 尝试使用不带参数的原始URL
    if (imageUrl.includes('?')) {
      const originalUrl = imageUrl.split('?')[0];
      setImageUrl(originalUrl);
      return;
    }

    // 作为最后的备用方案，使用占位图
    setImageUrl(`https://placehold.co/${width || 800}x${height || 600}/gray/white?text=Error`);
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
