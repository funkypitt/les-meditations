const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const axios = require('axios');
const fs = require('fs');

const app = express();

// Enable CORS
app.use(cors({
  origin: 'https://app.enpleineconscience.ch' // Remplacez par votre domaine
}));

// Serve static files from the frontend (dist folder)
app.use(express.static(path.join(__dirname, '../dist')));

// Fonction pour télécharger meditations.db
async function downloadDatabase() {
  const dbUrl = 'https://www.enpleineconscience.ch/app/meditations.db';
  const dbPath = path.join(__dirname, '../meditations.db'); // Stockage temporaire

  try {
    console.log('Downloading meditations.db...');
    const response = await axios.get(dbUrl, { responseType: 'arraybuffer' });
    fs.writeFileSync(dbPath, Buffer.from(response.data));
    console.log('meditations.db downloaded successfully.');
  } catch (error) {
    console.error('Error downloading meditations.db:', error.message);
    throw error;
  }
}

// Télécharger et initialiser la base de données au démarrage
(async () => {
  try {
    await downloadDatabase();

    // Connect to the SQLite database
    const db = new sqlite3.Database(path.join(__dirname, '../meditations.db'), (err) => {
      if (err) {
        console.error('Error connecting to database:', err);
        return;
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
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
