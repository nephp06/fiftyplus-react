import React from 'react';
import { Link } from 'react-router-dom';
import UnsplashImage from './UnsplashImage.jsx';
import './AcademySection.css';

const AcademySection = ({ courses }) => {
  return (
    <div className='academy-section-container'>
      <div className='academy-section'>
        <div className='section-header'>
          <h2 className='section-title'>
            <span className='highlight'>50+</span>學院
          </h2>
          <Link to='/academy' className='view-all-link'>
            查看所有課程 →
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
                <Link to={`/course/${course.id}`} className='course-title-link'>
                  <h3 className='course-title'>{course.title}</h3>
                </Link>
                <div className='course-period'>{course.period}</div>
                <div className='course-location'>
                  <div className='course-place'>{course.place}</div>
                  <div className='course-address'>{course.address}</div>
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
