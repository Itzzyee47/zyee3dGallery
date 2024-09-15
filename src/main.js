// src/main.js
import './style3.css'; // Import styles
import { initThreeScene } from './three-setup.js'; // Import the Three.js setup

// Initialize the Three.js scene once the page loads
window.onload = function() {
  initThreeScene();
};