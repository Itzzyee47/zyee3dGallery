// src/pages/About.jsx
import React from 'react';
import Footer from '../components/footer';
import './css/about.css';

const About = () => {
  return (
    <>
      <div className='aboutSection'>
        <div className="aboutContainer">
          {/* Profile Image */}
          <div className="profileImage">
            <img src="/imgs/me2.jpg" alt="Nzenze Lovis" />
          </div>

          {/* Contact Info */}
          <div className="contactInfo">
            <h1>Hi there,</h1>
            <h2>I'm Nzenze Lovis</h2>
            <p className="tagline">Software Engineer | 3D Artist | AI Enthusiast</p>
            
            <p className="description">
              Passionate about creating immersive digital experiences and exploring the intersection of art and technology.
            </p>

            {/* Contact Chips */}
            <div className="contactChips">
              <div className="contactChip">
                <span className="icon">📱</span>
                <span className="text">+237 652028940</span>
              </div>
              <div className="contactChip">
                <span className="icon">✉️</span>
                <span className="text">ebongloveis@gmail.com</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;
