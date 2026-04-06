const { verifyToken } = require('../utils/jwt.utils');

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get token from Authorization header
    // Header format: "Bearer eyJhbGci..."
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer '))
      return res.status(401).json({ error: 'No token provided' });

    // 2. Extract token (after "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Verify — throws if invalid or expired
    const decoded = verifyToken(token);

    // 4. Attach user ID to request — controllers use this
    req.userId    = decoded.id;
    req.userEmail = decoded.email;

    // 5. Call next() to proceed to the route handler
    next();

  } catch (err) {
    // jwt.verify() throws JsonWebTokenError or TokenExpiredError
    if (err.name === 'TokenExpiredError')
      return res.status(401).json({ error: 'Token expired, please login again' });

    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;