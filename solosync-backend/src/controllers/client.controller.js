const db = require('../db');

const getAllClients = async (req, res) => {
  try {
    // req.userId comes from auth middleware — guaranteed to exist
    const { rows } = await db.query(
      'SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]   // users can ONLY see their own clients
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createClient = async (req, res) => {
  const { name, email, phone, company } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO clients (user_id, name, email, phone, company)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [req.userId, name, email, phone, company]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getClient = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      'SELECT * FROM clients WHERE id = $1 AND user_id = $2',
      [id, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Client not found' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateClient = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, company } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE clients
       SET name = $1, email = $2, phone = $3, company = $4, updated_at = NOW()
       WHERE id = $5 AND user_id = $6
       RETURNING *`,
      [name, email, phone, company, id, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Client not found' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteClient = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      'DELETE FROM clients WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Client not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllClients,
  createClient,
  getClient,
  updateClient,
  deleteClient
};
