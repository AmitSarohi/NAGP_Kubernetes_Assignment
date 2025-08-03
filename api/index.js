const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Read and parse allowed origins from env variable
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('CORS not allowed for this origin'));
    }
  }
}));

app.use(express.json()); // Required to parse JSON bodies

const pool = new Pool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD
});

// GET all items
app.get('/api/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// ADD new item
app.post('/api/data', async (req, res) => {
  const { name, quantity } = req.body;

  if (!name || quantity == null) {
    return res.status(400).send("Missing name or quantity");
  }

  try {
    const result = await pool.query(
      'INSERT INTO items (name, quantity) VALUES ($1, $2) RETURNING *',
      [name, quantity]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// UPDATE item by ID
app.put('/api/data/:id', async (req, res) => {
  const { id } = req.params;
  const { name, quantity } = req.body;

  if (!name || quantity == null) {
    return res.status(400).send("Missing name or quantity");
  }

  try {
    const result = await pool.query(
      'UPDATE items SET name = $1, quantity = $2 WHERE id = $3 RETURNING *',
      [name, quantity, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).send('Item not found');
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

// DELETE item by ID
app.delete('/api/data/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).send('Item not found');
    }

    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
