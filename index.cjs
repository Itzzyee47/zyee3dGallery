// index.js
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

// Serve static assets (like models, scripts, and styles)
app.use(express.static('public'));

// Check if in production or development mode
const isProduction = process.env.NODE_ENV === 'production';

// Serve Vite in development mode
if (!isProduction) {
  const { createServer } = require('vite');
  (async () => {
    const vite = await createServer({
      server: { middlewareMode: true },
    });
    app.use(vite.middlewares);
  })();
} else {
  // Serve built files in production mode
  app.use(express.static(path.join(__dirname, 'dist')));
}

// Route for the landing page (serving static HTML)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/landing.html'));
});

// Route for the services page
app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/services.html'));
});

//Route for getting the model from the web storage
app.get('/model2', async (req, res) => {
  try {
    const response = await axios.get('https://firebasestorage.googleapis.com/v0/b/lsachatbot.appspot.com/o/models%2Fdonut.glb?alt=media&token=c9521955-2aab-4ab6-adfa-dda0183ec5f4', {
      responseType: 'arraybuffer',
      mode: 'no-cors'
    });
    res.set('Content-Type', 'model/gltf-binary');
    res.send(response.data);
  } catch (error) {
    res.status(500).send('Error fetching the model');
  }
});

// Route for the 3D gallery page
app.get('/gallery', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/views/gallery.html'));
});

// Start the server
const PORT = 3055;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
