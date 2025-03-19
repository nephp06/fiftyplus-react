// 本地备用图片映射
const localFallbackImages = {
  // 类别到本地图片路径的映射
  person: '/images/fallback/person.jpg',
  senior: '/images/fallback/senior.jpg',
  yoga: '/images/fallback/yoga.jpg',
  health: '/images/fallback/health.jpg',
  meditation: '/images/fallback/meditation.jpg',
  family: '/images/fallback/family.jpg',
  home: '/images/fallback/home.jpg',
  dance: '/images/fallback/dance.jpg',
  ballet: '/images/fallback/ballet.jpg',
  fashion: '/images/fallback/fashion.jpg',
  money: '/images/fallback/money.jpg',

  // 默认图片
  default: '/images/fallback/default.jpg',
};

// 检查图片是否存在
const checkImageExists = async (imagePath) => {
  try {
    const response = await fetch(imagePath, { method: 'HEAD' });
    return response.ok;
  } catch (err) {
    return false;
  }
};

// 获取本地备用图片
export const getLocalFallbackImage = async (categories) => {
  if (!categories) {
    return localFallbackImages.default;
  }

  // 将类别字符串转换为数组
  const categoryArray = categories.split(',').map((cat) => cat.trim());

  // 尝试找到匹配的类别
  for (const category of categoryArray) {
    if (localFallbackImages[category]) {
      const imagePath = localFallbackImages[category];
      const exists = await checkImageExists(imagePath);
      if (exists) {
        return imagePath;
      }
    }
  }

  // 如果没有匹配的类别或图片不存在，返回默认图片
  const defaultExists = await checkImageExists(localFallbackImages.default);
  if (defaultExists) {
    return localFallbackImages.default;
  }

  // 如果默认图片也不存在，返回占位图URL
  return null;
};

export default getLocalFallbackImage;
