import { getImageUrl } from '../../utils/imageUtils';

<div className="article-card-image">
  <img 
    src={getImageUrl(article.image_url)}
    alt={article.title}
    onError={(e) => {
      console.log('文章卡片圖片載入失敗，路徑:', e.target.src);
      e.target.onerror = null;
      e.target.src = '/assets/images/default-article.svg';
    }}
  />
</div> 