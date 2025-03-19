// 备用Unsplash图片集合，按类别分组
const fallbackImages = {
  // 人物相关
  person: [
    'https://images.unsplash.com/photo-1557804506-669a67965ba0',
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5',
    'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8',
  ],
  senior: [
    'https://images.unsplash.com/photo-1581579438747-104c53d7fbc4',
    'https://images.unsplash.com/photo-1556889882-73ea40694a98',
    'https://images.unsplash.com/photo-1478061653918-21b763e34a37',
  ],

  // 健康与瑜伽相关
  yoga: [
    'https://images.unsplash.com/photo-1552196563-55cd4e45efb3',
    'https://images.unsplash.com/photo-1588286840104-8957b019727f',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a',
  ],
  health: [
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b',
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773',
    'https://images.unsplash.com/photo-1505576399279-565b52d4ac71',
  ],
  meditation: [
    'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d',
    'https://images.unsplash.com/photo-1586373099939-d4f99a3391dc',
    'https://images.unsplash.com/photo-1591228127791-8e2eaef098d3',
  ],

  // 家庭相关
  family: [
    'https://images.unsplash.com/photo-1511895426328-dc8714191300',
    'https://images.unsplash.com/photo-1631891280092-910fb4698407',
    'https://images.unsplash.com/photo-1530103862676-de8c9debad1d',
  ],
  home: [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858',
  ],

  // 舞蹈相关
  dance: [
    'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
    'https://images.unsplash.com/photo-1596633607590-7156877ef734',
    'https://images.unsplash.com/photo-1615592704626-05e35cbc57fd',
  ],
  ballet: [
    'https://images.unsplash.com/photo-1518834107812-67b0b7c58434',
    'https://images.unsplash.com/photo-1587825045005-c58d565400d9',
    'https://images.unsplash.com/photo-1624648126538-e9bd1d83dada',
  ],

  // 时尚相关
  fashion: [
    'https://images.unsplash.com/photo-1479064555552-3ef4979f8908',
    'https://images.unsplash.com/photo-1558769132-cb1aea458c5e',
    'https://images.unsplash.com/photo-1445205170230-053b83016050',
  ],

  // 财务相关
  money: [
    'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e',
    'https://images.unsplash.com/photo-1565514020179-026b92b4c3b0',
    'https://images.unsplash.com/photo-1579621970795-87facc2f976d',
  ],

  // 默认图片
  default: [
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1',
    'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c',
    'https://images.unsplash.com/photo-1584559582128-b8be739912e1',
  ],
};

// 获取备用图片
export const getFallbackImage = (categories) => {
  if (!categories) return getRandomItem(fallbackImages.default);

  // 将类别字符串转换为数组
  const categoryArray = categories.split(',').map((cat) => cat.trim());

  // 尝试找到匹配的类别
  for (const category of categoryArray) {
    if (fallbackImages[category] && fallbackImages[category].length > 0) {
      return getRandomItem(fallbackImages[category]);
    }
  }

  // 如果没有匹配的类别，返回默认图片
  return getRandomItem(fallbackImages.default);
};

// 从数组中随机选择一项
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// 添加Unsplash图片参数
export const formatUnsplashUrl = (url, width, height) => {
  if (!url) return null;

  // 添加Unsplash参数：宽度、高度和质量
  return `${url}?w=${width || 800}&h=${
    height || 600
  }&q=80&auto=format&fit=crop`;
};
