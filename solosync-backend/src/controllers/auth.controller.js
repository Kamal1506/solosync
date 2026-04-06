const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../db');

// ── REGISTER ─────────────────────────────────
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Validate inputs
    if (!name || !email || !password)
      return res.status(400).json({ error: 'All fields required' });

    // 2. Check if email already exists
    const exists = await db.query(
      'SELECT id FROM users WHERE email = $1', [email]
    );
    if (exists.rows.length > 0)
      return res.status(409).json({ error: 'Email already registered' });

    // 3. Hash password (cost factor 12 = secure but not too slow)
    const password_hash = await bcrypt.hash(password, 12);

    // 4. Insert user into database
    const result = await db.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at`,
      [name, email, password_hash]
    );
    const user = result.rows[0];

    // 5. Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.status(201).json({ user, token });

  } catch (err) {
    res.status(500).json({ error: 'Server error', detail: err.message });
  }
};

// ── LOGIN ────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1', [email]
    );
    const user = result.rows[0];

    // 2. User not found — same error message as wrong password (security)
    if (!user)
      return res.status(401).json({ error: 'Invalid credentials' });

    // 3. Compare entered password with stored hash
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword)
      return res.status(401).json({ error: 'Invalid credentials' });

    // 4. Sign token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    // 5. Return user (without password) and token
    const { password_hash, ...safeUser } = user;
    res.json({ user: safeUser, token });

  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { register, login };