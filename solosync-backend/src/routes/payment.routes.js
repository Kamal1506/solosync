const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');

router.use(auth);

router.all('/', (req, res) => {
  res.status(501).json({ error: 'Payment routes are not implemented yet' });
});

router.all('/:id', (req, res) => {
  res.status(501).json({ error: 'Payment routes are not implemented yet' });
});

module.exports = router;
