const express = require('express');
const router = express.Router();
const { sendNotification } = require('./notificationService');
const dataService = require('./dataService');

router.post('/', async (req, res) => {
  const { message, deptNumbers } = req.body;

  if (!message || !Array.isArray(deptNumbers)) return res.status(400).send('Message and Department Numbers are required');

  const data = dataService.readDataFile();
  const notifications = [];

  for (const deptNumber of deptNumbers) {
    const user = data.users.find(u => u.deptNumber === deptNumber);
    if (user) {
      notifications.push(user);
      try {
        await sendNotification(message);
        user.notifications.push({ message, dateSent: new Date().toISOString() });
        dataService.writeDataFile(data);
        console.log(`Notification sent to ${deptNumber}`);
      } catch (error) {
        console.error(`Failed to send notification to ${deptNumber}:`, error.message);
      }
    }
  }

  notifications.length > 0 ? res.send('Notifications sent successfully!') : res.status(404).send('No valid departments found');
});

module.exports = router;
