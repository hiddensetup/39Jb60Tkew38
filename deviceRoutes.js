const express = require('express');
const router = express.Router();
const dataService = require('./dataService');

router.post('/', (req, res) => {
  const { deviceId, floorNumber, department } = req.body;

  if (!deviceId || !floorNumber || !department) {
    return res.status(400).send('Device ID, Floor Number, and Department are required');
  }

  const data = dataService.readDataFile();
  let user = data.users.find(u => u.floorNumber === floorNumber && u.department === department);

  if (!user) {
    user = {
      uuid: dataService.uuidv4(),
      floorNumber,
      department,
      devices: [],
      notifications: []
    };
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
