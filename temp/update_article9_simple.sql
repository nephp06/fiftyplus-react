-- 更新文章9的標題、摘要、標籤和圖片URL
UPDATE
    articles
SET
    title = '踏入60歲的心靈花園：心理師葉曉蓮談如何培養老年心理韌性',
    summary = '60歲資深臨床心理師葉曉蓮以專業知識和個人經驗，分享建立老年心理韌性的五大支柱。首先是接納生命的自然律動，坦然面對變化與無常；其次是保持好奇心和學習態度，透過持續學習提升認知功能和自我效能感；第三是維持和發展社會連結，積極參與社區活動、志願服務，建立有質量的人際關係；第四是培養靈性和意義感，探索生命意義和目的，建立超越自我的連結；最後是實踐身心整合的自我照顧，包括身體、情緒、認知、社交和靈性的全面關注。葉曉蓮強調，老年不是萎縮而是另一種形式的綻放，透過心理韌性的培養，人們可以在生命晚期獲得前所未有的自由、智慧和深度。',
    tags = '心理健康,老年心理,心靈成長,退休生活,正念練習',
    image_url = 'https://images.unsplash.com/photo-1556485689-33e55ab56127?q=80&w=1974&auto=format&fit=crop',
    image_category = 'mindfulness'
WHERE
    id = 9; 