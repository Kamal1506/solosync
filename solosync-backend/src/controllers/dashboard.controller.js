const db = require('../db');

const getDashboard = async (req, res) => {
  try {
    // Single query — joins 5 tables, computes everything at once
    const stats = await db.query(`
      SELECT
        COUNT(DISTINCT c.id)  AS total_clients,
        COUNT(DISTINCT p.id)  AS total_projects,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active')
                              AS active_projects,
        COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'done')
                              AS tasks_completed,
        COUNT(DISTINCT t.id) FILTER (WHERE t.due_date = CURRENT_DATE)
                              AS tasks_due_today,
        COALESCE(SUM(py.amount) FILTER (WHERE py.status='paid'), 0)
                              AS total_earned,
        COALESCE(SUM(py.amount) FILTER (WHERE py.status='pending'), 0)
                              AS pending_payments
      FROM users u
      LEFT JOIN clients c  ON c.user_id  = u.id
      LEFT JOIN projects p ON p.client_id = c.id
      LEFT JOIN tasks t    ON t.project_id = p.id
      LEFT JOIN payments py ON py.project_id = p.id
      WHERE u.id = $1`, [req.userId]);

    // Tasks due today — for the dashboard list
    const todayTasks = await db.query(`
      SELECT t.*, p.title AS project_title
      FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN clients c  ON c.id = p.client_id
      WHERE c.user_id = $1
        AND t.due_date = CURRENT_DATE
        AND t.status != 'done'
      ORDER BY t.priority DESC`, [req.userId]);

    // Projects nearing deadline (within 7 days)
    const urgentProjects = await db.query(`
      SELECT p.*, c.name AS client_name,
             p.deadline - CURRENT_DATE AS days_left
      FROM projects p
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = $1
        AND p.status = 'active'
        AND p.deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
      ORDER BY p.deadline ASC`, [req.userId]);

    res.json({
      stats:          stats.rows[0],
      todayTasks:     todayTasks.rows,
      urgentProjects: urgentProjects.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard };