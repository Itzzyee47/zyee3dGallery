// src/pages/Landing.jsx
import React from 'react'; 
import { Link } from 'react-router-dom';
import Navbar from '../components/Header';
import Footer from '../components/footer';
import './css/Landing.css';

const Landing = () => {
  return (
    <>
    <Navbar />
    <div id='landingPage'>
      
      <h1 className='archivo-black-regular'>Welcome to Nzenze's XR Gallery</h1>
      <div className="aboutGallery">
        This is a 3d gallery with FPS controlls to showcase some of my works as a 3d artist.
      </div>
      <h4>Click the link below to start the tour</h4>
      <Link to="/gallery" className='link_div'>View Gallery</Link>
      
    </div>
    <Footer />
    </>
  );
};

export default Landing;
