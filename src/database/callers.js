const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, '../../data.sqlite');
const db = new Database(dbPath);

// Récupère un utilisateur
function getUser(userId) {
  return db.prepare('SELECT * FROM callers WHERE user_id = ?').get(userId);
}

// Ajoute une close
function addCloseToUser(userId, username) {
  const user = getUser(userId);
  if (user) {
    db.prepare('UPDATE callers SET closes = closes + 1, xp = xp + 1 WHERE user_id = ?').run(userId);
  } else {
    db.prepare('INSERT INTO callers(user_id, username, closes, xp) VALUES (?, ?, 1, 1)').run(userId, username);
  }
}

// Récupère le top N des users par closes
function getTop(limit = 10) {
  return db.prepare('SELECT * FROM callers ORDER BY closes DESC LIMIT ?').all(limit);
}

// Exports
module.exports = { getUser, addCloseToUser, getTop };
