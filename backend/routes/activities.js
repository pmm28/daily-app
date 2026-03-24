const express = require('express');
const router = express.Router();
const { getActivities, createActivity, updateActivity, deleteActivity, reorderActivities } = require('../controllers/activitiesController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/:date', getActivities);
router.post('/', createActivity);
router.put('/reorder', reorderActivities);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;
