const errorHandler = (err, req, res, next) => {
  console.error(
    `[${new Date().toISOString()}] ${req.method} ${req.path}`,
    err.message
  );

  if (err.code === '23505')
    return res.status(409).json({ error: 'Record already exists' });

  if (err.code === '23503')
    return res.status(400).json({ error: 'Referenced record does not exist' });

  if (err.name === 'JsonWebTokenError')
    return res.status(401).json({ error: 'Invalid token' });

  if (err.name === 'TokenExpiredError')
    return res.status(401).json({ error: 'Token expired, please login again' });

  return res.status(500).json({ error: 'Internal server error' });
};

module.exports = { errorHandler };
