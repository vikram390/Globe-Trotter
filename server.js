
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'globetrotter_secret_key';

// Database Configuration
// In a real environment, these would be in process.env
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'globetrotter',
  password: 'Vikram@24062006',
  port: 5432,
});

app.use(cors());
app.use(express.json());

// --- Authentication Middleware ---
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// --- Auth Routes ---
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ error: 'Email already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET);
      delete user.password_hash;
      res.json({ user, token });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- Trip Routes ---
app.get('/api/trips', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM trips WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]);
    // Note: In a real app, you'd use a JOIN or subquery to fetch stops/activities
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/trips', authenticateToken, async (req, res) => {
  const { title, description, start_date, end_date, total_budget } = req.body;
  const share_token = Math.random().toString(36).substr(2, 12);
  try {
    const result = await pool.query(
      'INSERT INTO trips (user_id, title, description, start_date, end_date, total_budget, share_token) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [req.user.id, title, description, start_date, end_date, total_budget, share_token]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/trips/:id', async (req, res) => {
  try {
    // Fetch trip with stops and activities using JSON aggregation (PostgreSQL feature)
    const query = `
      SELECT t.*, 
        COALESCE(json_agg(s ORDER BY s.order_index) FILTER (WHERE s.id IS NOT NULL), '[]') as stops
      FROM trips t
      LEFT JOIN (
        SELECT s.*, 
          COALESCE(json_agg(a) FILTER (WHERE a.id IS NOT NULL), '[]') as activities
        FROM stops s
        LEFT JOIN activities a ON s.id = a.stop_id
        GROUP BY s.id
      ) s ON t.id = s.trip_id
      WHERE t.id = $1 OR t.share_token = $1
      GROUP BY t.id
    `;
    const result = await pool.query(query, [req.params.id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`GlobeTrotter Backend running on http://localhost:${PORT}`);
});
