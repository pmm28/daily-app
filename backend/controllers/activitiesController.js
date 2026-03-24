const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// Get or create entry for date, return entryId
const ensureEntry = (userId, date) => {
  let entry = db.get('entries').find({ userId, date }).value();
  if (!entry) {
    entry = { id: uuidv4(), userId, date, diary: '', mood: '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    db.get('entries').push(entry).write();
  }
  return entry;
};

// GET activities for a date
const getActivities = (req, res) => {
  const { date } = req.params;
  const entry = db.get('entries').find({ userId: req.userId, date }).value();
  if (!entry) return res.json([]);
  const activities = db.get('activities').filter({ entryId: entry.id }).value();
  res.json(activities);
};

// CREATE activity
const createActivity = (req, res) => {
  const { date, title, cat, tp, order } = req.body;
  if (!date || !title) return res.status(400).json({ error: 'date and title required' });

  const entry = ensureEntry(req.userId, date);
  const activity = { id: uuidv4(), entryId: entry.id, userId: req.userId, title, cat: cat || 'study', tp: tp || 'morning', order: order || 0, createdAt: new Date().toISOString() };
  db.get('activities').push(activity).write();
  res.status(201).json(activity);
};

// UPDATE activity
const updateActivity = (req, res) => {
  const { id } = req.params;
  const activity = db.get('activities').find({ id, userId: req.userId }).value();
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  const updates = {};
  if (req.body.title !== undefined) updates.title = req.body.title;
  if (req.body.cat !== undefined) updates.cat = req.body.cat;
  if (req.body.tp !== undefined) updates.tp = req.body.tp;
  if (req.body.order !== undefined) updates.order = req.body.order;
  db.get('activities').find({ id }).assign(updates).write();
  res.json(db.get('activities').find({ id }).value());
};

// DELETE activity
const deleteActivity = (req, res) => {
  const { id } = req.params;
  const activity = db.get('activities').find({ id, userId: req.userId }).value();
  if (!activity) return res.status(404).json({ error: 'Activity not found' });
  db.get('activities').remove({ id }).write();
  res.json({ message: 'Activity deleted' });
};

// REORDER activities (bulk update orders)
const reorderActivities = (req, res) => {
  const { orderedIds } = req.body; // array of activity ids in new order
  if (!Array.isArray(orderedIds)) return res.status(400).json({ error: 'orderedIds array required' });
  orderedIds.forEach((id, index) => {
    db.get('activities').find({ id, userId: req.userId }).assign({ order: index }).write();
  });
  res.json({ message: 'Reordered' });
};

module.exports = { getActivities, createActivity, updateActivity, deleteActivity, reorderActivities };
