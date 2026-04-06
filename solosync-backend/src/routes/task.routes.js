const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth.middleware');
const ctrl    = require('../controllers/task.controller');

router.use(auth);

router.get('/',              ctrl.getAllTasks);
router.post('/',             ctrl.createTask);
router.put('/:id/status',   ctrl.updateStatus);   // move on kanban
router.put('/:id',          ctrl.updateTask);
router.delete('/:id',       ctrl.deleteTask);

module.exports = router;