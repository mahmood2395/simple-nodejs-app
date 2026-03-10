const express = require('express');
const { Pool } = require('pg');
const morgan = require('morgan');

// Create an instance of the Express application
const app = express();
const port = 3000;

// PostgreSQL connection configuration
// const pool = new Pool({
//     user: 'psql',
//     host: '127.0.0.1',
//     database: 'test',
//     password: '',
//     port: 5432 // Change this if your PostgreSQL server is running on a different port
// });
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Middleware to parse JSON bodies
app.use(express.json());
app.use(morgan('dev')); 

// Home Page
app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Home Page</h1><p>This is the home page of the CRUD API.</p><p>Now on Docker.</p>');
  });

// Define routes for CRUD operations

// Create (POST)
app.post('/users', async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    const query = 'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *';
    const result = await pool.query(query, [name, email]);
    res.status(201).json(result.rows[0]); // 200 → 201
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Read (GET)
app.get('/users', async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Update (PUT)
app.put('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email } = req.body;
    const query = 'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *';
    const result = await pool.query(query, [name, email, id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Delete (DELETE)
app.delete('/users/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const query = 'DELETE FROM users WHERE id = $1 RETURNING *'; // add RETURNING *
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
if (require.main === module) {
  app.listen(3000, () => console.log("Server running on port 3000"));
}

module.exports = app;
module.exports.pool = pool;