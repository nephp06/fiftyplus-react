import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UnsplashImage from './UnsplashImage.jsx';
import './Carousel.css';

const Carousel = ({ slides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  const handlePrevClick = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className='carousel-container'>
      <div className='carousel'>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide ${
              index === currentSlide ? 'active' : ''
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            <div className='carousel-image'>
              <UnsplashImage
                category={slide.imageCategory}
                width={1200}
                height={500}
                alt={slide.title}
              />
            </div>
            <div className='slide-content'>
              <div className='slide-category'>{slide.category}</div>
              <h2 className='slide-title'>{slide.title}</h2>
              <p className='slide-subtitle'>{slide.subtitle}</p>
              <Link to={slide.url} className='slide-button'>
                查看更多
              </Link>
            </div>
          </div>
        ))}

        <button className='carousel-arrow prev' onClick={handlePrevClick}>
          &lt;
        </button>
        <button className='carousel-arrow next' onClick={handleNextClick}>
          &gt;
        </button>

        <div className='carousel-dots'>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`carousel-dot ${
                index === currentSlide ? 'active' : ''
              }`}
              onClick={() => handleDotClick(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
