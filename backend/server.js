const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Connect to the SQLite database
const db = new sqlite3.Database(process.env.DATABASE_PATH || './meditations.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// API endpoint to get all categories, sorted by category_order
app.get('/api/categories', (req, res) => {
  db.all('SELECT name, category_order, description FROM categories ORDER BY category_order', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to get all recordings
app.get('/api/recordings', (req, res) => {
  db.all('SELECT * FROM recordings ORDER BY category, recording_order', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// API endpoint to get recordings by category, including category description
app.get('/api/recordings/:category', (req, res) => {
  const category = req.params.category;

  // Fetch recordings
  db.all('SELECT * FROM recordings WHERE category = ? ORDER BY recording_order', [category], (err, recordings) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    // Fetch category description
    db.get('SELECT description FROM categories WHERE name = ?', [category], (err, categoryRow) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Combine recordings and category description in the response
      res.json({
        recordings: recordings,
        categoryDescription: categoryRow ? categoryRow.description : ''
      });
    });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
