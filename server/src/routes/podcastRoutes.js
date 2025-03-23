const express = require('express');
const router = express.Router();

// 獲取所有播客
router.get('/podcasts', (req, res) => {
  try {
    // 由於目前沒有數據庫，返回靜態數據
    const podcasts = [
      {
        id: 1,
        title: "正念冥想：找回內在平靜",
        description: "探索冥想之旅，學習如何在忙碌的生活中保持平靜",
        duration: "45分鐘",
        category: "冥想",
        publishDate: "2025/3/20",
        image_url: null
      },
      {
        id: 2,
        title: "情緒管理與自我成長",
        description: "學習識別、接納和管理情緒的技巧",
        duration: "38分鐘",
        category: "心理成長",
        publishDate: "2025/3/18",
        image_url: null
      },
      {
        id: 3,
        title: "壓力紓解與身心平衡",
        description: "實用的壓力管理方法和放鬆技巧",
        duration: "42分鐘",
        category: "壓力管理",
        publishDate: "2025/3/15",
        image_url: null
      }
    ];

    res.json({
      success: true,
      data: podcasts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '獲取播客列表失敗'
    });
  }
});

module.exports = router;
