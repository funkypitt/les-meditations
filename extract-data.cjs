const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

// Connect to the SQLite database
const db = new sqlite3.Database('backend/meditations.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database');
});

// Extract categories and recordings
const data = {};

// Fetch categories
db.all('SELECT name, category_order, description FROM categories ORDER BY category_order', (err, categories) => {
  if (err) {
    console.error('Error fetching categories:', err);
    process.exit(1);
  }

  data.categories = categories;

  // Fetch recordings
  db.all('SELECT * FROM recordings ORDER BY category, recording_order', (err, recordings) => {
    if (err) {
      console.error('Error fetching recordings:', err);
      process.exit(1);
    }

    data.recordings = recordings;

    // Write data to JSON file
    fs.writeFileSync('backend/meditations.json', JSON.stringify(data, null, 2));
    console.log('Data extracted to backend/meditations.json');

    // Close the database
    db.close();
  });
});
