const fs = require('fs');
const path = require('path');
const DATA_FILE = path.join(__dirname, 'data.json');

const initializeDataFile = () => {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
  }
};

const readDataFile = () => {
  initializeDataFile();
  return JSON.parse(fs.readFileSync(DATA_FILE));
};

const writeDataFile = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

const serveData = (req, res) => {
  try {
    res.json(readDataFile());
  } catch (error) {
    console.error('Failed to read data file:', error);
    res.status(500).send('Failed to load data.');
  }
};

module.exports = { readDataFile, writeDataFile, serveData };
