const db = require('../db');

const getAllTasks = async (req, res) => {
  const { project_id, status } = req.query;  // optional filters
  let query = `
    SELECT t.*, p.title AS project_title
    FROM tasks t
    JOIN projects p ON p.id = t.project_id
    JOIN clients c  ON c.id = p.client_id
    WHERE c.user_id = $1`;
  const params = [req.userId];

  if (project_id) { query += ` AND t.project_id = $2`; params.push(project_id); }
  if (status)     { query += ` AND t.status = $${params.length+1}`; params.push(status); }
  query += ' ORDER BY t.priority DESC, t.due_date ASC';

  const { rows } = await db.query(query, params);
  res.json(rows);
};

const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const valid = ['todo', 'in_progress', 'done'];

  if (!valid.includes(status))
    return res.status(400).json({ error: 'Invalid status' });

  const { rows } = await db.query(
    'UPDATE tasks SET status=$1 WHERE id=$2 RETURNING *',
    [status, id]
  );
  res.json(rows[0]);
};

const createTask = async (req, res) => {
  const { project_id, title, description, status, priority, due_date } = req.body;

  try {
    const { rows } = await db.query(
      `INSERT INTO tasks (project_id, title, description, status, priority, due_date)
       SELECT $1, $2, $3, $4, $5, $6
       FROM projects p
       JOIN clients c ON c.id = p.client_id
       WHERE p.id = $1 AND c.user_id = $7
       RETURNING *`,
      [project_id, title, description, status || 'todo', priority || 'medium', due_date, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Project not found' });

    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date } = req.body;

  try {
    const { rows } = await db.query(
      `UPDATE tasks t
       SET title = $1,
           description = $2,
           status = $3,
           priority = $4,
           due_date = $5
       FROM projects p
       JOIN clients c ON c.id = p.client_id
       WHERE t.project_id = p.id
         AND t.id = $6
         AND c.user_id = $7
       RETURNING t.*`,
      [title, description, status, priority, due_date, id, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Task not found' });

    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const { rows } = await db.query(
      `DELETE FROM tasks t
       USING projects p, clients c
       WHERE t.project_id = p.id
         AND p.client_id = c.id
         AND t.id = $1
         AND c.user_id = $2
       RETURNING t.id`,
      [id, req.userId]
    );

    if (rows.length === 0)
      return res.status(404).json({ error: 'Task not found' });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getAllTasks,
  createTask,
  updateStatus,
  updateTask,
  deleteTask
};
