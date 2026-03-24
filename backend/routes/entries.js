const express = require('express');
const router = express.Router();
const { getEntries, getEntryByDate, upsertEntry, deleteEntry } = require('../controllers/entriesController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/', getEntries);
router.get('/:date', getEntryByDate);
router.post('/', upsertEntry);
router.delete('/:date', deleteEntry);

module.exports = router;
