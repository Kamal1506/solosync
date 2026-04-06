const db = require('../db');

const getDashboard = async (req, res) => {
  const uid = req.userId;

  try {
    const stats = await db.query(`
      SELECT
        COUNT(DISTINCT c.id) AS total_clients,
        COUNT(DISTINCT p.id) FILTER (WHERE p.status = 'active')
          AS active_projects,
        COUNT(DISTINCT t.id) FILTER (WHERE t.status = 'done')
          AS tasks_completed,
        COUNT(DISTINCT t.id) FILTER (WHERE t.due_date < CURRENT_DATE
                                     AND t.status != 'done')
          AS overdue_tasks,
        COUNT(DISTINCT t.id) FILTER (WHERE t.due_date = CURRENT_DATE
                                     AND t.status != 'done')
          AS due_today,
        COALESCE(SUM(py.amount) FILTER (
          WHERE py.status = 'paid'
            AND DATE_TRUNC('month', py.paid_date) = DATE_TRUNC('month', CURRENT_DATE)
        ), 0) AS earned_this_month,
        COALESCE(SUM(py.amount) FILTER (
          WHERE py.status = 'paid'
            AND DATE_TRUNC('month', py.paid_date) =
                DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month')
        ), 0) AS earned_last_month,
        COALESCE(SUM(py.amount) FILTER (WHERE py.status = 'pending'), 0)
          AS pending_amount,
        COUNT(DISTINCT p.id) FILTER (
          WHERE p.id IN (
            SELECT project_id
            FROM tasks
            GROUP BY project_id
            HAVING COUNT(*) > 0
               AND COUNT(*) = COUNT(*) FILTER (WHERE status = 'done')
          ) AND p.status = 'active'
        ) AS projects_ready_to_invoice
      FROM users u
      LEFT JOIN clients c ON c.user_id = u.id
      LEFT JOIN projects p ON p.client_id = c.id
      LEFT JOIN tasks t ON t.project_id = p.id
      LEFT JOIN payments py ON py.project_id = p.id
      WHERE u.id = $1`, [uid]);

    const todayTasks = await db.query(`
      SELECT t.id, t.title, t.priority, t.status, t.due_date,
             p.title AS project_title
      FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = $1 AND t.due_date = CURRENT_DATE AND t.status != 'done'
      ORDER BY CASE t.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END`,
      [uid]);

    const overdueTasks = await db.query(`
      SELECT t.id, t.title, t.priority, t.due_date, p.title AS project_title,
             CURRENT_DATE - t.due_date AS days_overdue
      FROM tasks t
      JOIN projects p ON p.id = t.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = $1 AND t.due_date < CURRENT_DATE AND t.status != 'done'
      ORDER BY t.due_date ASC LIMIT 5`, [uid]);

    const oldPayments = await db.query(`
      SELECT py.id, py.amount, py.due_date, p.title AS project_title,
             c.name AS client_name, CURRENT_DATE - py.due_date AS days_pending
      FROM payments py
      JOIN projects p ON p.id = py.project_id
      JOIN clients c ON c.id = p.client_id
      WHERE c.user_id = $1 AND py.status = 'pending'
        AND py.due_date < CURRENT_DATE - INTERVAL '30 days'
      ORDER BY py.due_date ASC`, [uid]);

    const urgentProjects = await db.query(`
      SELECT p.id, p.title, p.deadline, c.name AS client_name,
             p.deadline - CURRENT_DATE AS days_left,
             ROUND(COUNT(t.id) FILTER (WHERE t.status = 'done') * 100.0
               / NULLIF(COUNT(t.id), 0)) AS completion_pct
      FROM projects p
      JOIN clients c ON c.id = p.client_id
      LEFT JOIN tasks t ON t.project_id = p.id
      WHERE c.user_id = $1 AND p.status = 'active'
        AND p.deadline BETWEEN CURRENT_DATE AND CURRENT_DATE + 7
      GROUP BY p.id, c.name
      ORDER BY p.deadline ASC`, [uid]);

    res.json({
      stats: stats.rows[0],
      todayTasks: todayTasks.rows,
      overdueTasks: overdueTasks.rows,
      overduePayments: oldPayments.rows,
      urgentProjects: urgentProjects.rows
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getDashboard };
