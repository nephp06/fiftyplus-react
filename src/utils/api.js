// API 实用工具函数

// 使用代理请求Unsplash图片
export const proxyFetchUnsplashImage = async (category, width, height) => {
  try {
    // 这里可以使用自己的代理服务器或选择其他API
    // 例如，可以使用CORS代理服务
    const baseUrl = 'https://corsproxy.io/?';
    const unsplashUrl = `https://source.unsplash.com/random/${width || 800}x${
      height || 600
    }${category ? `?${category}` : ''}`;
    const encodedUrl = encodeURIComponent(unsplashUrl);

    const response = await fetch(`${baseUrl}${encodedUrl}`, {
      method: 'GET',
      headers: {
        Accept: 'image/*',
      },
    });

    if (response.ok) {
      return response.url;
    } else {
      throw new Error('Failed to fetch through proxy');
    }
  } catch (error) {
    console.error('Proxy fetch error:', error);
    throw error;
  }
};

// 验证图片URL是否可访问
export const validateImageUrl = async (url) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.warn(`Image validation failed for: ${url}`, error);
    return false;
  }
};

export default {
  proxyFetchUnsplashImage,
  validateImageUrl,
};
