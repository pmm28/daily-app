const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'database.json'));
const db = low(adapter);

// Set defaults
db.defaults({
  users: [],
  entries: [],
  activities: []
}).write();

module.exports = db;
