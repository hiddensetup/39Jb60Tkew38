require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { sendNotification } = require('./notificationService');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const DATA_FILE = path.join(__dirname, 'data.json');

const initializeDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
  }
};

const readDataFile = () => {
  initializeDataFile();
  const rawData = fs.readFileSync(DATA_FILE);
  return JSON.parse(rawData);
};

const writeDataFile = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

app.post('/registerDevice', (req, res) => {
  const { deviceId, deptNumber } = req.body;

  if (!deviceId || !deptNumber) {
    return res.status(400).send('Device ID and Department Number are required');
  }

  const data = readDataFile();
  let user = data.users.find(u => u.deptNumber === deptNumber);

  if (!user) {
    user = { deptNumber, devices: [], notifications: [] };
    data.users.push(user);
  }

  const existingDevice = user.devices.find(d => d.deviceId === deviceId);
  if (!existingDevice) {
    user.devices.push({ deviceId, dateAdded: new Date().toISOString() });
    writeDataFile(data);
  }

  console.log('Device ID stored:', deviceId);
  res.send({ status: 'Device registered successfully' });
});

app.post('/sendNotification', (req, res) => {
  const { message, deptNumber } = req.body;

  if (!message || !deptNumber) {
    return res.status(400).send('Message and Department Number are required');
  }

  const data = readDataFile();
  const user = data.users.find(u => u.deptNumber === deptNumber);

  if (!user) {
    return res.status(404).send('User not found');
  }

  sendNotification(message)
    .then(response => {
      user.notifications.push({ message, dateSent: new Date().toISOString() });
      writeDataFile(data);

      console.log('Notification sent successfully:', response);
      res.send('Notification sent successfully!');
    })
    .catch(error => {
      console.error('Failed to send notification:', error.response ? error.response.data : error.message);
      res.status(500).send('Failed to send notification.');
    });
});

app.get('/sendNotification', (req, res) => {
  const { message, deptNumber } = req.query;

  if (!message || !deptNumber) {
    return res.status(400).send('Message and Department Number are required');
  }

  const data = readDataFile();
  const user = data.users.find(u => u.deptNumber === deptNumber);

  if (!user) {
    return res.status(404).send('User not found');
  }

  sendNotification(message)
    .then(response => {
      user.notifications.push({ message, dateSent: new Date().toISOString() });
      writeDataFile(data);

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
