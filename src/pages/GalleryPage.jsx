// src/pages/GalleryPage.jsx
import React from 'react';
import ThreeScene from '../components/Gallery';
import './css/GalleryPage.css';

function LoadingScreen() {
  return (
    <>
    <div className='loadScreen'>
      <h2>Loading 3D Resources...</h2>
      <div className="controls">
        <u><h2>Controls:</h2></u>
        <div className="controlBtns">
          <div className="controlBtn">a</div>, <div className="controlBtn">w</div>, <div className="controlBtn">s</div>, <div className="controlBtn">d</div>  
        </div> 
        to move left, forward, backwards and right respectively. Use your mouse, click to start looking around <br />
        Mobile controls not yet implemented.
      </div>
    </div>
    </>
  );
}


const GalleryPage = () => {
  return (
    <>
    <LoadingScreen />
    <div className="galleryDiv">
      <ThreeScene />
    </div>
    </>
  );
};

export default GalleryPage;
