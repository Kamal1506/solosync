const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth.middleware');
const ctrl    = require('../controllers/task.controller');
const { validateBody } = require('../middleware/validate.middleware');

router.use(auth);

router.get('/',              ctrl.getAllTasks);
router.post('/',             validateBody(['title', 'project_id']), ctrl.createTask);
router.put('/:id/status',   validateBody(['status']), ctrl.updateStatus);   // move on kanban
router.put('/:id',          ctrl.updateTask);
router.delete('/:id',       ctrl.deleteTask);

module.exports = router;
