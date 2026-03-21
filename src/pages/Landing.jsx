// src/pages/Landing.jsx
import React from 'react'; 
import { Link } from 'react-router-dom';
import Navbar from '../components/Header';
import LiquidEther from '../components/LiquidEther';
import Footer from '../components/footer';
import './css/Landing.css';

const Landing = () => {
  return (
    <>
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
      <LiquidEther
        colors={[ '#5227FF', '#FF9FFC', '#B19EEF' ]}
        mouseForce={20}
        cursorSize={100}
        isViscous
        viscous={30}
        iterationsViscous={32}
        iterationsPoisson={32}
        resolution={0.5}
        isBounce={false}
        autoDemo
        autoSpeed={0.5}
        autoIntensity={2.2}
        takeoverDuration={0.25}
        autoResumeDelay={3000}
        autoRampDuration={0.6}
        color0="#5227FF"
        color1="#FF9FFC"
        color2="#B19EEF"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
    />
    <div style={{ position: 'relative', zIndex: 1 }}>
      <Navbar />
      <div id='landingPage'>
        <h1 className='archivo-black-regular'>Welcome to Nzenze's XR Gallery</h1>
        <div className="aboutGallery">
          This is a 3D gallery with FPS controls to showcase some of my works as a 3D artist.
        </div>
        <h4>Click the link below to start the tour</h4>
        <Link to="/gallery" className='link_div'>View Gallery</Link>
      </div>
      <Footer />
    </div>
    </div>
    </>
  );
};

export default Landing;
