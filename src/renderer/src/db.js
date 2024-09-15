// db.js (Backend or Electron Main process)
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'database.db'); // SQLite database file

const db = new sqlite3.Database(dbPath);

// Create a table for storing tokens
db.run(`CREATE TABLE IF NOT EXISTS auth (id INTEGER PRIMARY KEY, token TEXT)`);

// Save token in SQLite
function saveToken(token) {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO auth (token) VALUES (?)`, [token], function (err) {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

// Get token from SQLite
function getToken() {
  return new Promise((resolve, reject) => {
    db.get(`SELECT token FROM auth ORDER BY id DESC LIMIT 1`, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row ? row.token : null);
      }
    });
  });
}

// Clear token from SQLite (Logout)
function clearToken() {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM auth`, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

module.exports = { saveToken, getToken, clearToken };
