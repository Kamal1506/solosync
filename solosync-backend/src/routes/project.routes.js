const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const ctrl = require('../controllers/project.controller');
const { validateBody } = require('../middleware/validate.middleware');

router.use(auth);

router.get('/', ctrl.getAllProjects);
router.post('/', validateBody(['client_id', 'title']), ctrl.createProject);
router.get('/:id', ctrl.getProject);
router.put('/:id', ctrl.updateProject);
router.delete('/:id', ctrl.deleteProject);

module.exports = router;
