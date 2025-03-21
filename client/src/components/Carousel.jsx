import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Carousel.css';

const Carousel = ({ slides, autoPlay = true, interval = 6000 }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (!autoPlay) return;
    
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, interval);

    return () => clearInterval(slideInterval);
  }, [slides.length, autoPlay, interval]);

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
      <div className='carousel owl-carousel'>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`carousel-slide item ${
              index === currentSlide ? 'active' : ''
            }`}
            style={{
              transform: `translateX(${(index - currentSlide) * 100}%)`,
            }}
          >
            <Link to={slide.url} className="carousel-link">
              <img 
                src={slide.imageUrl} 
                alt={slide.title} 
                className="carousel-image"
              />
              <div className='infoBox'>
                <div className='info'>
                  <div className='title'>
                    {slide.category}
                  </div>
                  <div className='h2'>{slide.title}</div>
                  <p>{slide.subtitle}</p>
                </div>
              </div>
            </Link>
          </div>
        ))}

        <button className='carousel-arrow prev' onClick={handlePrevClick}>
          &lt;
        </button>
        <button className='carousel-arrow next' onClick={handleNextClick}>
          &gt;
        </button>

        <div className='carousel-dots owl-dots'>
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              className={`carousel-dot owl-dot ${
                index === currentSlide ? 'active' : ''
              }`}
              onClick={() => handleDotClick(index)}
            >
              <span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
