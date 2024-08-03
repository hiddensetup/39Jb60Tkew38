require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const { sendNotification } = require('./notificationService');

const app = express();
const port = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data file exists
const initializeDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
  }
};

// Read and write data
const readDataFile = () => {
  initializeDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const writeDataFile = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Register device
app.post('/registerDevice', (req, res) => {
  const { deviceId, deptNumber } = req.body;

  if (!deviceId || !deptNumber) return res.status(400).send('Device ID and Department Number are required');

  const data = readDataFile();
  let user = data.users.find(u => u.deptNumber === deptNumber);

  if (!user) {
    user = { deptNumber, devices: [], notifications: [] };
    data.users.push(user);
  }

  if (!user.devices.find(d => d.deviceId === deviceId)) {
    user.devices.push({ deviceId, dateAdded: new Date().toISOString() });
    writeDataFile(data);
  }

  console.log('Device ID stored:', deviceId);
  res.send({ status: 'Device registered successfully' });
});

// Send notifications
app.post('/sendNotification', async (req, res) => {
  const { message, deptNumbers } = req.body;

  if (!message || !Array.isArray(deptNumbers)) return res.status(400).send('Message and Department Numbers are required');

  const data = readDataFile();
  const notifications = [];

  for (const deptNumber of deptNumbers) {
    const user = data.users.find(u => u.deptNumber === deptNumber);
    if (user) {
      notifications.push(user);
      try {
        await sendNotification(message);
        user.notifications.push({ message, dateSent: new Date().toISOString() });
        writeDataFile(data);
        console.log(`Notification sent to ${deptNumber}`);
      } catch (error) {
        console.error(`Failed to send notification to ${deptNumber}:`, error.message);
      }
    }
  }

  notifications.length > 0 ? res.send('Notifications sent successfully!') : res.status(404).send('No valid departments found');
});

// Serve data
app.get('/data', (req, res) => {
  try {
    res.json(readDataFile());
  } catch (error) {
    console.error('Failed to read data file:', error);
    res.status(500).send('Failed to load data.');
  }
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${port}`);
});
