require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dataService = require('./dataService');
const deviceRoutes = require('./deviceRoutes');
const notificationRoutes = require('./notificationRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve data
app.use('/data', (req, res) => dataService.serveData(req, res));

// Register device and send notifications
app.use('/registerDevice', deviceRoutes);
app.use('/sendNotification', notificationRoutes);

// Route handlers for HTML files without extension
const pages = ['index', 'register', 'sender', 'board'];
pages.forEach(page => {
  app.get(`/${page}`, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', `${page}.html`));
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
