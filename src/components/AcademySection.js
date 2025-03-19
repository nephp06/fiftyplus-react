import React from 'react';
import { Link } from 'react-router-dom';
import UnsplashImage from './UnsplashImage';
import './AcademySection.css';

const AcademySection = ({ courses }) => {
  return (
    <div className='academy-section-container'>
      <div className='academy-section'>
        <div className='academy-header'>
          <h2 className='academy-title'>
            <span className='highlight'>50+</span>學院
          </h2>
          <Link to='/academy' className='view-all-link'>
            查看所有課程 <span className='arrow'>→</span>
          </Link>
        </div>

        <div className='courses'>
          {courses.map((course) => (
            <div key={course.id} className='course-card'>
              <div className='course-image'>
                <UnsplashImage
                  category={course.imageCategory}
                  width={400}
                  height={250}
                  alt={course.title}
                />
              </div>
              <div className='course-content'>
                <div className='course-info'>
                  <h3 className='course-title'>{course.title}</h3>
                  <p className='course-period'>{course.period}</p>
                  <p className='course-location'>
                    <span className='location-name'>{course.place}</span>
                    <span className='location-address'>{course.address}</span>
                  </p>
                </div>
                <Link to={`/course/${course.id}`} className='course-button'>
                  了解詳情
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AcademySection;
