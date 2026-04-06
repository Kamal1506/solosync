const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const { getDashboard } = require('../controllers/dashboard.controller');

router.use(auth);

router.get('/', getDashboard);

module.exports = router;
