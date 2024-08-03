require('dotenv').config(); // Make sure to load environment variables

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { sendNotification } = require('./notificationService');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/sendNotification', (req, res) => {
  const { message } = req.body;

  sendNotification(message)
    .then(response => {
      console.log('Notification sent successfully:', response);
      res.send('Notification sent successfully!');
    })
    .catch(error => {
      console.error('Failed to send notification:', error.response ? error.response.data : error.message);
      res.status(500).send('Failed to send notification.');
    });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
