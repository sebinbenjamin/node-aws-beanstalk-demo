const express = require('express');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3000;

// Create a connection pool
const pool = mysql.createPool({
  uri: process.env.DATABASE_URL, // Use the DATABASE_URL environment variable for the connection URI
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware to check database connection
app.use(async (req, res, next) => {
  try {
    await pool.getConnection();
    next();
  } catch (err) {
    console.error('Database connection failed:', err.stack);
    res.status(500).send('Database connection failed');
  }
});

// Basic route
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Status route
app.get('/status', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT VERSION() AS version');
    res.json({
      status: 'OK',
      version: rows[0].version
    });
  } catch (err) {
    console.error('Failed to query database:', err.stack);
    res.status(500).send('Failed to query database');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
