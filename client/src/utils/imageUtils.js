/**
 * 處理圖片URL，確保能夠正確訪問
 * @param {string} imageUrl - 原始圖片URL
 * @param {string} defaultImage - 默認圖片URL，如果原始URL無效
 * @returns {string} 處理後的圖片URL
 */
export const getImageUrl = (
  imageUrl,
  defaultImage = '/assets/images/default-article.svg'
) => {
  if (!imageUrl) return defaultImage;

  // 如果是完整的URL（以http或https開頭）
  if (imageUrl.startsWith('http')) {
    // 確保Unsplash圖片具有較好的質量和合適的大小
    if (imageUrl.includes('unsplash.com')) {
      // 如果已經包含參數，不添加新參數
      if (imageUrl.includes('?')) {
        return imageUrl;
      }
      // 添加質量和裁剪參數
      return `${imageUrl}?q=80&w=800&h=600&auto=format&fit=crop`;
    }
    return imageUrl;
  }

  // 如果是上傳路徑（以/uploads開頭）
  if (imageUrl.startsWith('/uploads')) {
    // 直接使用相對路徑，依賴Vite代理功能
    return imageUrl;
    // 如需直接訪問，使用以下代碼
    // return `http://localhost:5003${imageUrl}`;
  }

  // 其他情況返回默認圖片
  return defaultImage;
};

/**
 * 獲取封面圖片的URL
 * @param {Object} article - 文章對象
 * @returns {string} 封面圖片URL
 */
export const getCoverImageUrl = (article) => {
  const imageUrl = article.coverImage || article.image_url;
  return getImageUrl(imageUrl);
};
