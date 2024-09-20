// src/pages/About.jsx
import React from 'react';
import Footer from '../components/footer';
import './css/about.css';

const About = () => {
  return (
    <>
      <div className='contactSection'>
        <h1>Contacts</h1>
        <div className="contactForm">
          <div className="myImg">
            <img className='mImg' src="/imgs/me2.jpg" alt="myself" />
          </div>
          <div className="contacts">
            <h2>Hi there, <br /> I'm Nzenze Lovis</h2>
            <h4 >A software engineer | 3d artist and AI enthusiast</h4>
            <div>
              You can get in touch with me via the following means: <br />
              <div className="chips">
                <div className="chip">
                  <img src="/imgs/avatar.png" alt="Person" width="96" height="96"/>
                  +237 652028940
                </div>
                <div className="chip">
                  <img src="/imgs/avatar.png" alt="Person" width="96" height="96"/>
                  ebongloveis@gmail.com
                </div>
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
