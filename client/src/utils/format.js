/**
 * 格式化数字
 * @param {number} num - 要格式化的数字
 * @returns {string} - 格式化后的字符串
 */
export const formatNumber = (num) => {
  if (!num && num !== 0) return '0';

  if (num >= 10000) {
    return `${Math.floor(num / 10000)}萬`;
  }
  if (num >= 1000) {
    return `${Math.floor(num / 1000)}千`;
  }
  return num.toString();
};

/**
 * 格式化浏览量数字
 * @param {number} views - 浏览量数字
 * @returns {string} - 格式化后的字符串
 */
export const formatViews = (views) => {
  return formatNumber(views);
};
