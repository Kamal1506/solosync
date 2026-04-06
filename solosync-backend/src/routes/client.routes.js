const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth.middleware');
const ctrl    = require('../controllers/client.controller');

// auth middleware runs before every route below
router.use(auth);

router.get('/',       ctrl.getAllClients);   // GET  /api/clients
router.post('/',      ctrl.createClient);   // POST /api/clients
router.get('/:id',    ctrl.getClient);      // GET  /api/clients/:id
router.put('/:id',    ctrl.updateClient);   // PUT  /api/clients/:id
router.delete('/:id', ctrl.deleteClient);   // DEL  /api/clients/:id

module.exports = router;