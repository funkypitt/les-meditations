const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Load meditations data from JSON file
const meditationsData = require('./meditations.json');

// API endpoint to get all categories, sorted by category_order
app.get('/api/categories', (req, res) => {
  try {
    const categories = meditationsData.categories || [];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get all recordings
app.get('/api/recordings', (req, res) => {
  try {
    const recordings = meditationsData.recordings || [];
    res.json(recordings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to get recordings by category, including category description
app.get('/api/recordings/:category', (req, res) => {
  try {
    const category = req.params.category;
    const recordings = (meditationsData.recordings || []).filter(rec => rec.category === category)
      .sort((a, b) => a.recording_order - b.recording_order);
    const categoryRow = (meditationsData.categories || []).find(cat => cat.name === category);

    res.json({
      recordings: recordings,
      categoryDescription: categoryRow ? categoryRow.description : ''
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
