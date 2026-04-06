const express    = require('express');
const router     = express.Router();
const { register, login } = require('../controllers/auth.controller');
const { validateBody } = require('../middleware/validate.middleware');

router.post('/register', validateBody(['name', 'email', 'password']), register);
router.post('/login', validateBody(['email', 'password']), login);

module.exports = router;
// Full URL: POST /api/auth/register
// Full URL: POST /api/auth/login
