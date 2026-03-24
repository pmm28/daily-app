const { v4: uuidv4 } = require('uuid');
const db = require('../db/database');

// GET all entries for user (optionally filter by date)
const getEntries = (req, res) => {
  const { date } = req.query;
  let entries = db.get('entries').filter({ userId: req.userId }).value();
  if (date) entries = entries.filter(e => e.date === date);
  // Attach activities to each entry
  entries = entries.map(e => ({
    ...e,
    activities: db.get('activities').filter({ entryId: e.id }).value()
  }));
  res.json(entries);
};

// GET single entry by date
const getEntryByDate = (req, res) => {
  const { date } = req.params;
  const entry = db.get('entries').find({ userId: req.userId, date }).value();
  if (!entry) return res.json(null);
  const activities = db.get('activities').filter({ entryId: entry.id }).value();
  res.json({ ...entry, activities });
};

// CREATE or UPDATE entry
const upsertEntry = (req, res) => {
  const { date, diary, mood } = req.body;
  if (!date) return res.status(400).json({ error: 'Date is required' });

  const existing = db.get('entries').find({ userId: req.userId, date }).value();
  if (existing) {
    db.get('entries').find({ id: existing.id }).assign({ diary, mood, updatedAt: new Date().toISOString() }).write();
    const updated = db.get('entries').find({ id: existing.id }).value();
    const activities = db.get('activities').filter({ entryId: existing.id }).value();
    return res.json({ ...updated, activities });
  }

  const entry = { id: uuidv4(), userId: req.userId, date, diary: diary || '', mood: mood || '', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  db.get('entries').push(entry).write();
  res.status(201).json({ ...entry, activities: [] });
};

// DELETE entry
const deleteEntry = (req, res) => {
  const { date } = req.params;
  const entry = db.get('entries').find({ userId: req.userId, date }).value();
  if (!entry) return res.status(404).json({ error: 'Entry not found' });
  db.get('entries').remove({ id: entry.id }).write();
  db.get('activities').remove({ entryId: entry.id }).write();
  res.json({ message: 'Entry deleted' });
};

module.exports = { getEntries, getEntryByDate, upsertEntry, deleteEntry };
