const Article = require('../models/Article');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sequelize = require('./database');
const userController = require('../controllers/userController');

async function seedDatabase() {
  try {
    // 使用sync({ force: false })來保留現有數據，只創建尚不存在的表
    await sequelize.sync({ force: false });
    console.log('數據庫同步完成，保留現有數據');

    // 檢查是否需要添加默認用戶
    const userCount = await User.count();
    if (userCount === 0) {
      // 只有在用戶表為空時才添加默認用戶
      await userController.seedUsers();
      console.log('默認用戶創建成功');
    } else {
      console.log(`數據庫中已有 ${userCount} 個用戶，跳過初始用戶創建`);
    }

    // 檢查是否需要添加文章數據
    const articleCount = await Article.count();
    if (articleCount === 0) {
      const peopleArticles = [
        {
          title:
            '清空住了20多年的家，一個人坐在客廳地板覺得好自由！音樂人陳小霞：當你明白自己是誰，可以活得「越老越大」',
          category: 'people',
          imageCategory: 'music',
          views: 71910,
          created_at: new Date('2025-03-14'),
        },
        {
          title:
            '當年負債1.6億，一度站在窗邊：「跳下去，明天報紙會怎麼寫？」曹啟泰：能搞笑主持，是快樂救了我',
          category: 'people',
          imageCategory: 'tv',
          views: 133487,
          created_at: new Date('2025-03-12'),
        },
        {
          title:
            '從小被笑「醜八怪」，到登上國際舞台！林昱珊：當你開始熱愛自己，連缺陷都變成了特色',
          category: 'people',
          imageCategory: 'fashion',
          views: 89245,
          created_at: new Date('2025-03-10'),
        },
        {
          title:
            '50歲轉行做甜點師！李美玲：人生沒有太晚的開始，只要你願意踏出第一步',
          category: 'people',
          imageCategory: 'food',
          views: 65732,
          created_at: new Date('2025-03-08'),
        },
        {
          title: '從企業高管到山村教師，張明德：找到生命的意義，比成功更重要',
          category: 'people',
          imageCategory: 'education',
          views: 92156,
          created_at: new Date('2025-03-06'),
        },
        {
          title:
            '克服聽障成為音樂治療師，黃雅琪：生命中的每個限制，都是讓我們更強大的機會',
          category: 'people',
          imageCategory: 'health',
          views: 78431,
          created_at: new Date('2025-03-04'),
        },
      ];

      const whatsNewArticles = [
        {
          title:
            '每天刷牙、洗臉做運動，竟比仰臥起坐更能瘦小腹？國家級教練甘思元：讓「腹腔」變小，才能瘦肚子',
          category: 'health',
          imageCategory: 'fitness',
          views: 45678,
          created_at: new Date('2025-03-15'),
        },
        {
          title:
            'PODCAST | 50+Talk ep124. 沒有瘦不了的肚子！國家級教練甘思元：小腹大不一定脂肪多，3步驟重塑「瘦體骨架」',
          category: 'podcast',
          imageCategory: 'health',
          views: 34567,
          created_at: new Date('2025-03-15'),
        },
        {
          title: '退休後的第二人生：5個重新定義生活的方式',
          category: 'lifestyle',
          imageCategory: 'retirement',
          views: 23456,
          created_at: new Date('2025-03-14'),
        },
        {
          title: '銀髮族理財術：如何規劃安穩的退休生活',
          category: 'finance',
          imageCategory: 'money',
          views: 12345,
          created_at: new Date('2025-03-13'),
        },
      ];

      await Article.bulkCreate([...peopleArticles, ...whatsNewArticles]);
      console.log('文章數據填充完成！');
    } else {
      console.log(`數據庫中已有 ${articleCount} 篇文章，跳過初始文章創建`);
    }
  } catch (error) {
    console.error('填充數據庫時出錯:', error);
  }
}

module.exports = seedDatabase;
