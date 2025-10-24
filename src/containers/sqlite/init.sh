#!/bin/sh
echo "Setting up database..."

sqlite3 /data/users.db <<EOF
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  twofa_method TEXT DEFAULT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_settings (
  user_id INTEGER PRIMARY KEY,
  theme TEXT DEFAULT 'light',
  notifications_enabled INTEGER DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tmp_2fa_codes (
  user_id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  expires_at DATETIME NOT NULL
);

CREATE TABLE IF NOT EXISTS totp_2fa (
  user_id TEXT PRIMARY KEY,
  secret TEXT NOT NULL
);
EOF

echo "Database setup complete."

tail -f /dev/null
