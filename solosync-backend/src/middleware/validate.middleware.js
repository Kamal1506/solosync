/**
 * validateBody(['title', 'project_id'])
 * Returns middleware that checks req.body for required fields.
 */
const validateBody = (fields) => (req, res, next) => {
  const missing = fields.filter((field) => !req.body[field]);

  if (missing.length) {
    return res.status(400).json({
      error: 'Missing required fields',
      fields: missing
    });
  }

  next();
};

module.exports = { validateBody };
