const express = require('express');
const router = express.Router();

// In-memory store for device tokens (for demo purposes)
let deviceTokens = []; 

// Endpoint to register device tokens
router.post('/registerDevice', (req, res) => {
  const { deviceId } = req.body;

  if (!deviceId) {
    return res.status(400).send('Device ID is required');
  }

  // Save deviceId to the in-memory store
  deviceTokens.push(deviceId);
  console.log('Device ID stored:', deviceId);

  // Respond with success
  res.send({ status: 'Device registered successfully' });
});

module.exports = router;
