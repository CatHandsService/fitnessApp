// server.js
const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 5000;

app.use(express.json());

// Load mockTabs data
let mockTabs = require('./mockTabs.json');

// GET: Retrieve all tabs
app.get('/tabs', (req, res) => {
  res.json(mockTabs);
});

// POST: Add new workout item
app.post('/tabs', (req, res) => {
  const newItem = req.body;
  mockTabs.tabs.forEach(tab => {
    if (tab.id === newItem.tab) {
      tab.tasks.push(newItem);
    }
  });

  // Save the updated data to the file
  fs.writeFile('./mockTabs.json', JSON.stringify(mockTabs, null, 2), (err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to save data' });
    }
    res.status(201).json(newItem);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
