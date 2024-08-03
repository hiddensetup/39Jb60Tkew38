const express = require('express');
const router = express.Router();
const dataService = require('./dataService');

router.post('/', (req, res) => {
  const { deviceId, deptNumber } = req.body;

  if (!deviceId || !deptNumber) return res.status(400).send('Device ID and Department Number are required');

  const data = dataService.readDataFile();
  let user = data.users.find(u => u.deptNumber === deptNumber);

  if (!user) {
    user = { deptNumber, devices: [], notifications: [] };
    data.users.push(user);
  }

  if (!user.devices.find(d => d.deviceId === deviceId)) {
    user.devices.push({ deviceId, dateAdded: new Date().toISOString() });
    dataService.writeDataFile(data);
  }

  console.log('Device ID stored:', deviceId);
  res.send({ status: 'Device registered successfully' });
});

module.exports = router;
