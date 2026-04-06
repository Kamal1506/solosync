const db = require('../db');

const getAllProjects = async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT p.*, c.name AS client_name
       FROM projects p
       JOIN clients c ON c.id = p.client_id
       WHERE c.user_id = $1
       ORDER BY p.deadline ASC NULLS LAST, p.created_at DESC`,
      [req.userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createProject = async (req, res) => {
  const { client_id, title, description, deadline, budget, status } = req.body;

  if (!client_id || !title)
    return res.status(400).json({ error: 'client_id and title are required' });

  try {
    const { rows } = await db.query(
      `INSERT INTO projects (client_id, title, description, deadline, budget, status)
       SELECT c.id, $2, $3, $4, $5, $6
       FROM clients c
       WHERE c.id = $1 AND c.user_id = $7
       RETURNING *`,
      [client_id, title, description || null, deadline || null, budget || null, status || 'active', req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Client not found' });

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProject = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      `SELECT p.*, c.name AS client_name
       FROM projects p
       JOIN clients c ON c.id = p.client_id
       WHERE p.id = $1 AND c.user_id = $2`,
      [id, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Project not found' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProject = async (req, res) => {
  const { id } = req.params;
  const { client_id, title, description, deadline, budget, status } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE projects p
       SET client_id = COALESCE($1, p.client_id),
           title = COALESCE($2, p.title),
           description = COALESCE($3, p.description),
           deadline = COALESCE($4, p.deadline),
           budget = COALESCE($5, p.budget),
           status = COALESCE($6, p.status)
       FROM clients c
       WHERE p.id = $7
         AND c.id = COALESCE($1, p.client_id)
         AND c.user_id = $8
       RETURNING p.*`,
      [client_id || null, title || null, description || null, deadline || null, budget || null, status || null, id, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Project not found' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      `DELETE FROM projects p
       USING clients c
       WHERE p.client_id = c.id
         AND p.id = $1
         AND c.user_id = $2
       RETURNING p.id`,
      [id, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Project not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllProjects,
  createProject,
  getProject,
  updateProject,
  deleteProject
};
