const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();

// Liste des origines autorisées
const allowedOrigins = [
  'https://app.enpleineconscience.ch',
  'https://les-meditations.vercel.app',
  'https://les-meditations-99wkm84gr-pierre-gallazs-projects.vercel.app',
  'http://localhost:5173'
];

// Enable CORS
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

// Serve static files from the frontend (dist folder)
app.use(express.static(path.join(__dirname, '../dist')));

// Connect to the SQLite database
const db = new sqlite3.Database(path.join(__dirname, 'meditations.db'), (err) => {
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

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
})();
