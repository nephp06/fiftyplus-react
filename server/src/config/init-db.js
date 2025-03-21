const db = require('./database');

const initDatabase = () => {
  // 删除已存在的表
  db.run('DROP TABLE IF EXISTS articles', (err) => {
    if (err) {
      console.error('删除表失败:', err);
      return;
    }

    // 创建文章表
    db.run(
      `
      CREATE TABLE IF NOT EXISTS articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        category TEXT,
        imageCategory TEXT,
        views INTEGER DEFAULT 0,
        status TEXT DEFAULT 'published',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `,
      (err) => {
        if (err) {
          console.error('创建表失败:', err);
          return;
        }

        // 插入测试数据
        const articles = [
          {
            title: '60歲創業家陳美麗：「年齡只是數字，熱情才是動力」',
            content: JSON.stringify([
              {
                type: 'paragraph',
                content:
                  '陳美麗在60歲那年，毅然決然地開始了她的創業之路。「很多人說我瘋了，但我覺得人生不該設限。」她如是說。',
              },
              {
                type: 'paragraph',
                content:
                  '在退休前，陳美麗是一名高中教師。教書之餘，她一直保持著對烘焙的熱愛。',
              },
              {
                type: 'image',
                url: 'baking',
                caption: '陳美麗在她的烘焙教室中',
              },
              {
                type: 'paragraph',
                content:
                  '「我想要打造一個空間，讓更多銀髮族能夠找到新的興趣，認識志同道合的朋友。」這就是她創立「樂齡烘焙工作室」的初衷。',
              },
            ]),
            category: 'people',
            imageCategory: 'entrepreneur',
            views: 15800,
          },
          {
            title: '退休後的第二人生：探索新的可能',
            content: JSON.stringify([
              {
                type: 'paragraph',
                content:
                  '退休不是終點，而是新生活的開始。越來越多的銀髮族選擇在退休後開始新的冒險。',
              },
              { type: 'image', url: 'retirement', caption: '快樂的退休生活' },
              {
                type: 'paragraph',
                content:
                  '本文將為您介紹幾位退休後活出精彩人生的例子，以及他們的心得分享。',
              },
            ]),
            category: 'lifestyle',
            imageCategory: 'retirement',
            views: 12300,
          },
          {
            title: '銀髮族健康管理：三高預防與保健',
            content: JSON.stringify([
              {
                type: 'paragraph',
                content:
                  '隨著年齡增長，高血壓、高血糖、高血脂的「三高」問題越發常見。本文將介紹如何通過飲食和運動來預防和管理這些健康問題。',
              },
              { type: 'image', url: 'health', caption: '健康的生活方式' },
              {
                type: 'paragraph',
                content:
                  '專家建議：定期運動、均衡飲食、保持心理健康是預防三高的關鍵。',
              },
            ]),
            category: 'health',
            imageCategory: 'health',
            views: 18500,
          },
          {
            title: '心靈成長：擁抱人生的黃金歲月',
            content: JSON.stringify([
              {
                type: 'paragraph',
                content:
                  '50+是人生的黃金階段，我們有更多時間關注自己的內心成長。',
              },
              { type: 'image', url: 'mindfulness', caption: '冥想與心靈成長' },
              {
                type: 'paragraph',
                content:
                  '通過冥想、閱讀、寫作等方式，我們可以更好地認識自己，享受當下的生活。',
              },
            ]),
            category: 'mind',
            imageCategory: 'mindfulness',
            views: 9600,
          },
        ];

        // 使用Promise.all来确保所有插入操作完成
        const insertPromises = articles.map((article) => {
          return new Promise((resolve, reject) => {
            db.run(
              `INSERT INTO articles (title, content, category, imageCategory, views, status)
             VALUES (?, ?, ?, ?, ?, 'published')`,
              [
                article.title,
                article.content,
                article.category,
                article.imageCategory,
                article.views,
              ],
              function (err) {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        });

        Promise.all(insertPromises)
          .then(() => {
            console.log('數據庫初始化完成');
          })
          .catch((err) => {
            console.error('插入數據失敗:', err);
          });
      }
    );
  });
};

module.exports = initDatabase;
