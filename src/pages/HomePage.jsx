import React from 'react';
import Header from '../components/Header.jsx';
import Carousel from '../components/Carousel.jsx';
import WhatsNew from '../components/WhatsNew.jsx';
import CategorySection from '../components/CategorySection.jsx';
import AcademySection from '../components/AcademySection.jsx';
import Footer from '../components/Footer.jsx';
import './HomePage.css';

const HomePage = () => {
  // 文章数据（实际项目中可从API获取）
  const peopleArticles = [
    {
      id: 1,
      date: '三月 14,2025',
      title:
        '清空住了20多年的家，一個人坐在客廳地板覺得好自由！音樂人陳小霞：當你明白自己是誰，可以活得「越老越大」',
      imageCategory: 'person,senior,music',
      views: 67686,
    },
    {
      id: 2,
      date: '三月 12,2025',
      title:
        '當年負債1.6億，一度站在窗邊：「跳下去，明天報紙會怎麼寫？」曹啟泰：能搞笑主持，是快樂救了我',
      imageCategory: 'portrait,smile,success',
      views: 132947,
    },
  ];

  const mindArticles = [
    {
      id: 3,
      date: '三月 19,2025',
      title:
        '覺得老父母囤積、家裡雜亂？洪蘭：這是強化記憶的做法！兒女該認清自己是客，無權干涉',
      imageCategory: 'home,family,elderly',
      views: 46,
    },
    {
      id: 4,
      date: '三月 07,2025',
      title:
        '練習一個人的武林，100歲都瀟灑！蔡詩萍：人生如馬拉松，最好的啟發常不在起點、而是最後一段路',
      imageCategory: 'meditation,wellness,nature',
      views: 59162,
    },
  ];

  const hotArticles = [
    {
      id: 5,
      number: 1,
      title: '如何讓血管變年輕？台、日醫師建議3作法，增加血液循環、防猝死',
      imageCategory: 'health,heart,medical',
    },
    {
      id: 6,
      number: 2,
      title:
        '覺得老父母囤積、家裡雜亂？洪蘭：這是強化記憶的做法！兒女該認清自己是客，無權干涉',
      imageCategory: 'family,home,elderly',
    },
    {
      id: 7,
      number: 3,
      title:
        '孩子35歲獲贈與，比60歲後拿遺產效益更大！夏韻芬：何時把財產交給子女，對他們的人生最好？',
      imageCategory: 'family,money,estate',
    },
  ];

  const courses = [
    {
      id: 1,
      title: '50+熟齡空中瑜珈第11期',
      period: '2025/03/24 ~ 2025/05/19',
      imageCategory: 'yoga,senior,fitness',
      place: 'Nature Flow',
      address: '台北市中正區忠孝東路二段18號2樓',
    },
    {
      id: 2,
      title: '50+熟齡佛朗明哥入門班第1期',
      period: '2025/03/05 ~ 2025/05/29',
      imageCategory: 'dance,flamenco,senior',
      place: 'MOON PLACE',
      address: '台北市信義路二段7號B1',
    },
    {
      id: 3,
      title: '熟齡Barre芭蕾體態雕塑第9期',
      period: '2025/03/17 ~ 2025/05/19',
      imageCategory: 'ballet,barre,fitness',
      place: '六號實驗室當代舞蹈藝術學院',
      address: '台北市中山區雙城街3巷11-1號5樓',
    },
  ];

  const slides = [
    {
      id: 1,
      title: '熟齡頌缽療癒瑜珈',
      subtitle: '找回內心的安寧與和諧',
      category: '50+學院',
      imageCategory: 'meditation,yoga,singing-bowl',
      url: '/activity/1336',
    },
    {
      id: 2,
      title: '50+更衣間│穿搭美學進化論 Find your style',
      subtitle:
        '給自己一個舒心的晚上，跟著沈春華、李明川暢聊，穿搭優雅升級，一學就會！',
      category: '50+學院',
      imageCategory: 'fashion,senior,style',
      url: '/activity/1349',
    },
  ];

  return (
    <div className='home-page'>
      <Header />
      <Carousel slides={slides} />
      <WhatsNew articles={hotArticles} />
      <div className='content-sections'>
        <CategorySection title='人物' articles={peopleArticles} />
        <CategorySection title='心靈' articles={mindArticles} />
      </div>
      <AcademySection courses={courses} />
      <Footer />
    </div>
  );
};

export default HomePage;
